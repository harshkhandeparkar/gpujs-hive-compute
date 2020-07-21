import { GPU, KernelFunction, KernelOutput } from 'gpu.js';
import WS from 'ws';

import { TELL_DATA } from './types';
import { ASK_ACTIONS, TELL_ACTIONS } from './constants';
import { ask, onTell, } from './comm';
import generateKernelOptions from './generateKernelOptions';

export default function runKernel(  
  gpu: GPU,
  kernelFunc: Function | string,
  kernelOptions: any,
  inputsLength: number,
  inputs: number[],
  helperList: WS[],
  cb: (finalOutput: number[]) => void
) {
  const kernelOpts = generateKernelOptions(kernelOptions, helperList.length);

  helperList.forEach((helper: WS, i) => { // Build kernel on each helper
    ask(helper, {
      action:ASK_ACTIONS.BUILD_KERNEL,
      extras: {
        kernelFunc: kernelFunc.toString(),
        kernelOptions: kernelOpts[i+1]
      }
    })
  })

  console.log(`Building kernel locally.`);
  const k = gpu.createKernel(kernelFunc as KernelFunction, kernelOpts[0]);

  let builtKernelHelpers = 0;
  let outputs: {
    out: number[],
    index: number
  }[] = [];
  let kernelRunHelpers = 0;
  helperList.forEach((helper, helperId) => {
    onTell(helper, TELL_ACTIONS.KERNEL_BUILT, (data: TELL_DATA) => {
      console.log(`Kernel built on helper #${helperId}, running.`);
      builtKernelHelpers++;

      if (builtKernelHelpers === helperList.length) {
        console.log(`All kernels built, running.`);
        helperList.forEach(helper => {
          ask(helper, {
            action: ASK_ACTIONS.RUN_KERNEL,
            extras: {
              inputsLength,
              inputs
            }
          })
        })

        console.log(`Running Kernel Locally`);
        let out: KernelOutput;

        if (inputsLength > 0) out = k();
        else out = k(...inputs);

        outputs.push({
          out: Object.values(out as any[]),
          index: 0
        })
      }
    })

    onTell(helper, TELL_ACTIONS.KERNEL_RUN_DONE, (data: TELL_DATA) => {
      console.log(`Kernel run on helper #${helperId}.`);
      kernelRunHelpers++;
      outputs.push({
        out: Object.values(data.extras.output),
        index: helperId + 1
      })

      if (kernelRunHelpers === helperList.length) {
        console.log(`All kernels run, generating final output`);
        let finalOutput: number[] = [];
        outputs = outputs.sort((output1, output2) => output1.index - output2.index); // sort in order

        outputs.forEach(output => finalOutput = finalOutput.concat(output.out));
        cb(finalOutput);
      }
    })
  })
}