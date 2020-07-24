import generate1DKernelOptions from './generate1DKernelOptions';
import generate2DKernelOptions from './generate2DKernelOptions';

export default function generateOutput(
  initialOptions: any,
  numHelpers: number,
  outputDimensions: number
) {
  switch(outputDimensions) {
    case 1:
      return generate1DKernelOptions(initialOptions, numHelpers);
    case 2:
      return generate2DKernelOptions(initialOptions, numHelpers);
  }
}