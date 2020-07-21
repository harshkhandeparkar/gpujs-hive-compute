import WS from 'ws';
import { GPU, IKernelRunShortcut, KernelOutput } from 'gpu.js';

import { COMM_TYPE, ASK_ACTIONS, TELL_ACTIONS } from './util/constants';
import { ASK_DATA } from './util/types';
import { onAsk, tell, onTell } from './util/comm';

/**
 * 
 * @param url WebSocket URL e.g: ws://localhost:4532
 */
export default function help(url: string) {
  const ws = new WS(url);
  const gpu = new GPU();
  let k: IKernelRunShortcut; // build kernel will be stored here
  
  ws.on('open', () => {
    console.log('Connecting as helper.');
    ws.send(JSON.stringify({type: COMM_TYPE.REQUEST_CONN, data: {}}));
  
    onTell(ws, TELL_ACTIONS.CONN_ACCEPTED, () => console.log('Connection Accepted.'));
  })
  
  ws.on('close', () => console.log(`Connection refused or closed unexpectedly.`))
  
  onAsk(ws, ASK_ACTIONS.BUILD_KERNEL, (data: ASK_DATA) => { // Build the kernel
    console.log('building');
    k = gpu.createKernel(data.extras.kernelFunc, data.extras.kernelOptions); //  Build the kernel
    console.log('built');
  
    tell(ws, {
      action: TELL_ACTIONS.KERNEL_BUILT
    })
  })
  
  onAsk(ws, ASK_ACTIONS.RUN_KERNEL, (data: ASK_DATA) => { // Run the kernel
    console.log('running');
    let output: KernelOutput;
    if (data.extras.inputsLength > 0) output = k(...data.extras.inputs); //  Run the kernel
    else output = k();
    console.log('done');
  
    tell(ws, {
      action: TELL_ACTIONS.KERNEL_RUN_DONE,
      extras: {
        output: output
      }
    })
  })
}