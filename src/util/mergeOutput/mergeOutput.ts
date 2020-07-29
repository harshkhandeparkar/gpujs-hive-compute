import merge1DOutput, { Output1D } from './merge1DOutput';
import merge2DOutput, { Output2D } from './merge2DOutput';

export default function mergeOutput(
  outputs: {
    out: Output1D | Output2D,
    index: number
  }[],
  outputDimensions: number,
  options: any[] // To get the offsets
) {
  switch (outputDimensions) {
    case 1:
      return merge1DOutput(outputs as { out: Output1D, index: number }[]);
    case 2:
      return merge2DOutput(outputs as { out: Output2D, index: number }[], options);
  }
}

export { Output2D } from './merge2DOutput';
export { Output1D } from './merge1DOutput';