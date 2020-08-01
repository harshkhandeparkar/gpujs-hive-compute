import WS from 'ws';
import { GPU, IGPUKernelSettings, KernelOutput } from 'gpu.js';
import { address } from 'ip';

import runKernel from './util/runKernel';
import standardizeOutput from './util/standardizeOutput';
import { onConnect, onDisconnect, tell } from './util/comm';
import { wsPort } from './config.json';
import { TELL_ACTIONS } from './util/constants';

/**
 * 
 * @param gpu Instance of a GPU.js `GPU` class.
 * @param func The kernel function to be run
 * @param kernelOptions Kernel options/settings (currently only supports 1-D)
 * @param doContinueOnHelperJoin A callback that is fired whenever a new helper joins. Return true to run the kernel and false to wait for more helpers.
 * @param logFunction A custom log function
 * @param cb Callback that is fired when the run is complete
 * @param input input for the kernel
 */
export function hiveRun(
  gpu: GPU,
  func: Function,
  kernelOptions: IGPUKernelSettings,
  onWaitingForHelpers: (url: string) => void,
  doContinueOnHelperJoin: (numHelpers: number) => boolean,
  logFunction: Function = console.log,
  cb: (output: KernelOutput) => void,
  input: any[] = []
): void {
  const output = standardizeOutput(kernelOptions.output);
  kernelOptions.output = output.finalOutput;

  if (output.dimensions > 2) throw 'Only 1-D and 2-D outputs are supported as of now';

  const server = new WS.Server({ port: wsPort }); // Initialize the WebSocket server
  onWaitingForHelpers(`ws://${address()}:${wsPort}`);

  const helperList: WS[] = []; // List of all helper websockets
  let acceptingConnections = true;

  const inputsLength = func.length;

  server.on('connection', (ws: WS) => {
    onConnect(ws, ws => {
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
          runKernel(gpu, func, kernelOptions, output.dimensions, inputsLength, input, helperList, (...args) => {
              server.close(); // Stop the server
              return cb(...args);
            },
            logFunction
          ) 
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