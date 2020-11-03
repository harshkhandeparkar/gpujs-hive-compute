import { GPU, IKernelRunShortcut, KernelOutput } from 'gpu.js';

import { COMM_TYPE, ASK_ACTIONS, TELL_ACTIONS } from './constants';
import { ASK_DATA } from './types';
import { onAsk, tell, onTell } from './comm';

/**
 *
 * @param gpu Instance of GPU.js `GPU` class
 * @param url WebSocket URL e.g: ws://localhost:4532
 * @param logFunction A custom log function
 */
export async function runHelper(WS: any, gpu: GPU, url: string, logFunction: Function = console.log) {
  return new Promise((resolve: () => void, reject: (e: Error) => void) => {
    const ws = new WS(url);
    let k: IKernelRunShortcut; // build kernel will be stored here

    ws.on('open', () => {
      logFunction('Connecting as helper.');
      ws.send(JSON.stringify({type: COMM_TYPE.REQUEST_CONN, data: {}}));

      onTell(ws, TELL_ACTIONS.CONN_ACCEPTED, () => logFunction('Connection accepted.'));
    })

    ws.on('error', () => {
      reject(new Error('WebSocket error.'));
    })

    ws.on('close', () => {
      logFunction('Connection closed.');
      resolve();
    })

    onAsk(ws, ASK_ACTIONS.BUILD_KERNEL, (data: ASK_DATA) => { // Build the kernel
      logFunction('Building kernel.');
      k = gpu.createKernel(data.extras.kernelFunc, data.extras.kernelOptions); //  Build the kernel
      logFunction('Kernel built.');

      tell(ws, {
        action: TELL_ACTIONS.KERNEL_BUILT
      })
    })

    onAsk(ws, ASK_ACTIONS.RUN_KERNEL, (data: ASK_DATA) => { // Run the kernel
      logFunction('Running kernel.');
      let output: KernelOutput;
      if (data.extras.inputsLength > 0) output = k(...data.extras.inputs); //  Run the kernel
      else output = k();
      logFunction('Output generated, transmitting.');

      tell(ws, {
        action: TELL_ACTIONS.KERNEL_RUN_DONE,
        extras: {
          output: output
        }
      })
    })
  })
}
