import WS from 'ws';
import { GPU, IGPUKernelSettings, IKernelXYZ } from 'gpu.js';
import { address } from 'ip';

import runKernel from './util/runKernel';
import offsetKernel from './util/offsetKernel';
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
 * @param cb Callback that is fired when the run is complete
 * @param input input for the kernel
 */
export function hiveRun(
  gpu: GPU,
  func: Function,
  kernelOptions: IGPUKernelSettings,
  doContinueOnHelperJoin: (numHelpers: number) => boolean,
  cb: (output: any[]) => void,
  input: any[] = []
): void {
  const output = standardizeOutput(kernelOptions.output);
  kernelOptions.output = output.finalOutput;

  // Only 1-D output is supported as of now.
  if (output.dimensions > 1) throw 'Only 1-D output is supported as of now';

  const server = new WS.Server({ port: wsPort }); // Initialize the WebSocket server
  console.log(`URL: ws://${address()}:${wsPort}`);

  const helperList: WS[] = []; // List of all helper websockets
  let acceptingConnections = true;

  const kernelFunc = offsetKernel(func);
  const inputsLength = func.length;

  server.on('connection', (ws: WS) => {
    onConnect(ws, ws => {
      const helperId = helperList.length;

      if (acceptingConnections) {
        tell(ws, {
          action: TELL_ACTIONS.CONN_ACCEPTED
        })

        helperList.push(ws);
        console.log(`New Helper #${helperId} Joined !!`);

        const run = doContinueOnHelperJoin(helperList.length);
        if (run) {
          console.log('Building + Running on hive');

          acceptingConnections = false;
          runKernel(gpu, kernelFunc, kernelOptions, inputsLength, input, helperList, cb); 
        }

        onDisconnect(ws, () => {
          console.log(`Helper #${helperId} Disconnected :(`);
          helperList.splice(helperId, helperId + 1);
        })
      }
      else ws.close();
    })
  })
}