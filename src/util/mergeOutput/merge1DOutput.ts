export type Output1D = number[];

export default function merge1DOutput(
  outputs: {
    out: Output1D,
    index: number
  }[]
) {
  let finalOutput: number[] = [];
  outputs = outputs.sort((output1, output2) => output1.index - output2.index); // sort in order

  outputs.forEach(output => finalOutput = finalOutput.concat(output.out));
  return Object.assign({}, finalOutput); // To match with the output type of gpu.js
}