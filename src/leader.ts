import WS from 'ws';
import { GPU, IGPUKernelSettings, KernelOutput } from 'gpu.js';
import { address } from 'ip';

import runKernel from './util/runKernel';
import standardizeOutput from './util/standardizeOutput';
import { onConnect, onDisconnect, tell } from './util/comm';
import { wsPort } from './config.json';
import { TELL_ACTIONS } from './util/constants';

export type hiveRunOptions = {
  /** Instance of gpu.js GPU class */
  gpu: GPU,
  /** Kernel Function */
  func: Function,
  /** GPU.js kernel options/settings */
  kernelOptions: IGPUKernelSettings,
  /** A callback that is fired once the leader starts and is waiting for helpers to join */
  onWaitingForHelpers: (url: string) => void,
  /** A callback that is fired each time a new helper joins, return true to start running the kernel and false otherwise */
  doContinueOnHelperJoin: (numHelpers: number) => boolean,
  /** A log function for internal logs, default console.log */
  logFunction: (...logs: any) => void,
  /** Inputs for the kernel, an array of arguments. */
  inputs: any[]
}

export const hiveRunDefaults = {
  logFunction: console.log
}

export async function hiveRun(options: hiveRunOptions) {
  return new Promise(
    (
      resolve: (output: KernelOutput) => void,
      reject: (e: Error) => void
    ) => {
      options = {
        ...hiveRunDefaults,
        ...options
      }

      const { gpu, func, kernelOptions, onWaitingForHelpers, doContinueOnHelperJoin, logFunction, cb, inputs: input } = options;

      const output = standardizeOutput(kernelOptions.output);
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
            logFunction(`New Helper #${helperId} Joined !!`);

            const run = doContinueOnHelperJoin(helperList.length);
            if (run) {
              logFunction('Building + Running on hive');

              acceptingConnections = false;
              const out = await runKernel(
                gpu,
                func,
                kernelOptions,
                output.dimensions,
                inputsLength,
                input,
                helperList,
                logFunction
              )

              resolve(out);
              server.close();
            }

            onDisconnect(ws, () => {
              logFunction(`Helper #${helperId} Disconnected :(`);
              helperList.splice(helperId, helperId + 1);
            })
          }
          else ws.close();
        })
      })
    }
  )
}
