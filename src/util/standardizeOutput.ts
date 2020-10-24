import { IKernelXYZ } from 'gpu.js'

export default function standardizeOutput(output: IKernelXYZ | [number, number?, number?]) {
  let finalOutput: [
    number,
    number?,
    number?
  ]

  if (Object.getOwnPropertyNames(output).includes('x')) {
    output = output as IKernelXYZ;
    // Convert object to array
    finalOutput = [output.x];

    if (output.y) finalOutput.push(output.y);
    if (output.z) finalOutput.push(output.z);
  }
  else finalOutput = <[number, number?, number?]>output;

  return {
    finalOutput,
    dimensions: finalOutput.length
  }
}
