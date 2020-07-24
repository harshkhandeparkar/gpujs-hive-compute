import merge1DOutput, { Output1D } from './merge1DOutput';
import { Output2D } from './merge2DOutput';

export default function mergeOutput(
  outputs: {
    out: Output1D | Output2D,
    index: number
  }[],
  outputDimensions: number,
  options: any // To get the offsets
) {
  switch (outputDimensions) {
    case 1:
      return merge1DOutput(outputs as {out: Output1D, index: number}[]);
  }
}

export { Output2D } from './merge2DOutput';
export { Output1D } from './merge1DOutput';