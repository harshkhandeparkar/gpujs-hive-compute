import WS from 'ws';
import { KernelOutput } from 'gpu.js';
import { address } from 'ip';

import runKernel from '../util/runKernel';
import standardizeOutput from '../util/standardizeOutput';
import { onConnect, onDisconnect, tell } from '../util/comm';
import { TELL_ACTIONS } from '../util/constants';
import { HiveRunOptions, HiveRunSettings } from './types/leader-types';
import { hiveRunDefaults } from './constants/hive-run-defaults';

export async function hiveRun(options: HiveRunOptions) {
  return new Promise(
    (
      resolve: (output: KernelOutput) => void,
      reject: (e: Error) => void
    ) => {
      const settings: HiveRunSettings = {
        ...hiveRunDefaults,
        ...options
      }

      const {
        gpu,
        func,
        kernelOptions,
        onWaitingForHelpers,
        doContinueOnHelperJoin,
        logFunction,
        inputs,
        wsPort
      } = settings;

      const output = standardizeOutput(<[number, number?, number?]>kernelOptions.output);
      kernelOptions.output = output.finalOutput;

      if (output.dimensions > 2) {
        return reject(new Error('Only 1-D and 2-D outputs are supported as of now'));
      }

      const server = new WS.Server({ port: wsPort }); // Initialize the WebSocket server
      onWaitingForHelpers(`ws://${address()}:${wsPort}`);

      const helperList: WS[] = []; // List of all helper websockets
      let acceptingConnections = true;

      const inputsLength = func.length;

      server.on('connection', (ws: WS) => {
        onConnect(ws, async ws => {
          const helperId = helperList.length;

          if (acceptingConnections) {
            tell(ws, {
              action: TELL_ACTIONS.CONN_ACCEPTED
            })

            helperList.push(ws);
            logFunction(`New helper #${helperId} joined.`);

            const run = doContinueOnHelperJoin(helperList.length);
            if (run) {
              acceptingConnections = false;
              const out = await runKernel(
                gpu,
                func,
                kernelOptions,
                output.dimensions,
                inputsLength,
                inputs,
                helperList,
                logFunction
              )

              resolve(out);
              server.close();
            }

            onDisconnect(ws, () => {
              logFunction(`Helper #${helperId} disconnected.`);
              helperList.splice(helperId, helperId + 1);
            })
          }
          else ws.close();
        })
      })
    }
  )
}
