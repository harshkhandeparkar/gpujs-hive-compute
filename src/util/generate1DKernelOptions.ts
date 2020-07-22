export default function generateKernelOptions(
  initialOptions: any,
  numHelpers: number
) {
  let opts: any[] = [];

  const largestDivident = Math.floor(initialOptions.output[0] / (numHelpers + 1)); // equally distribute among each helper
  let leftOver = initialOptions.output[0] % (numHelpers + 1); // left over can be unevenly distributed

  for (let i = 0; i < numHelpers + 1; i++) {
    let hive_offset_x = 0; // offset for the kernel threads
    if (opts.length > 0) opts.forEach(opt => hive_offset_x += opt.output[0]) // summation of all older options

    opts.push({
      ...initialOptions,
      output: [largestDivident + 1 * Math.sign(leftOver)], // add 1 if something is left over
      constants: {
        ...initialOptions.constants,
        hive_offset_x,
        hive_output_x: initialOptions.output[0]
      }
    })

    if (leftOver > 0) leftOver--; // reduce the leftver until exhausted
  }
  return opts;
}