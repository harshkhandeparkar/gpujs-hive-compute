export type Output2D = number[][];

export default function merge2DOutput(
  outputs: {
    out: Output2D,
    index: number
  }[],
  options: any[] // To get the offsets
) {
  let finalOutput: number[] = [];
  outputs = outputs.sort((output1, output2) => output1.index - output2.index); // sort in order

  
  return finalOutput;
}