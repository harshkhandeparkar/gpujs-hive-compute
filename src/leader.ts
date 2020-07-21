import WS from 'ws';
import { GPU, IGPUKernelSettings, IKernelXYZ } from 'gpu.js';
import { address } from 'ip';
import { question } from 'readline-sync';

import runKernel from './util/runKernel';
import offsetKernel from './util/offsetKernel';
import { onConnect, onDisconnect, tell } from './util/comm';
import { wsPort } from './config.json';
import { TELL_ACTIONS } from './util/constants';

/**
 * 
 * @param gpu Instance of a GPU.js `GPU` class.
 * @param func The kernel function to be run
 * @param kernelOptions Kernel options/settings (currently only supports 1-D)
 * @param input input for the kernel
 */
export default function hiveRun(
  gpu: GPU,
  func: Function,
  kernelOptions: IGPUKernelSettings,
  cb: (output: any[]) => void,
  input: any[] = []
): void {
  // Only 1-D output is supported as of now.
  if (
    (typeof kernelOptions.output == 'object' && (kernelOptions.output as IKernelXYZ).y) // if 2-D or 3-D
    ||
    (kernelOptions.output as number[]).length > 1 // if 2-D or 3-D
  ) throw 'Only 1-D output is supported as of now';

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

        const run = question(`Start running the kernel(y/N)?: `); // start running or not
        if (run.toLowerCase() === 'y') {
          console.log('Building + Running on hive');

          acceptingConnections = false;
          runKernel(gpu, kernelFunc, kernelOptions, inputsLength, input, helperList, cb)
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