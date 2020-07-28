import { GPU, KernelFunction, KernelOutput } from 'gpu.js';
import WS from 'ws';

import { TELL_DATA } from './types';
import { ASK_ACTIONS, TELL_ACTIONS } from './constants';
import { ask, onTell, } from './comm';
import offsetKernel from './offsetKernel';
import generateOptions from './generateOptions/generateOptions';
import mergeOutput, { Output1D, Output2D } from './mergeOutput/mergeOutput';

export default function runKernel(  
  gpu: GPU,
  kernelFunc: Function,
  kernelOptions: any,
  outputDimensions: number,
  inputsLength: number,
  inputs: number[],
  helperList: WS[],
  cb: (finalOutput: KernelOutput) => void
) {
  const kernelOpts = generateOptions(kernelOptions, helperList.length, outputDimensions);
  kernelFunc = offsetKernel(kernelFunc);

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

  let builtKernelHelpers = 0; // Number of helpers that completed building the kernel
  let outputs: {
    out: Output1D | Output2D,
    index: number
  }[] = [];
  let kernelRunHelpers = 0; // Number of helpers that completed running the kernel

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

        let out: KernelOutput;

        if (inputsLength > 0) out = k(...inputs);
        else out = k();

        outputs.push({
          out: Object.values(out as Object) as (Output1D | Output2D),
          index: 0
        })
      }
    })

    onTell(helper, TELL_ACTIONS.KERNEL_RUN_DONE, (data: TELL_DATA) => {
      console.log(`Kernel run on helper #${helperId}.`);
      kernelRunHelpers++;
      outputs.push({
        out: Object.values(data.extras.output) as (Output1D | Output2D),
        index: helperId + 1
      })

      if (kernelRunHelpers === helperList.length) {
        console.log(`All kernels run, generating final output`);
        cb(mergeOutput(outputs, outputDimensions, kernelOpts));
      }
    })
  })
}