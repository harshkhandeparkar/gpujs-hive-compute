import { IKernelXYZ } from 'gpu.js'

export default function standardizeOutput(output: IKernelXYZ | number[]) {
  let finalOutput: any;

  if (Object.getOwnPropertyNames(output).includes('x')) {
    output = output as IKernelXYZ;
    // Convert object to array
    finalOutput = [];

    if (output.x) finalOutput.push(output.x);
    if (output.y) finalOutput.push(output.y);
    if (output.z) finalOutput.push(output.z);
  }
  else finalOutput = output;

  return {
    finalOutput,
    dimensions: finalOutput.length
  }
}