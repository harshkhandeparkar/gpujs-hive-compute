export type Output2D = number[][];

export default function merge2DOutput(
  outputs: {
    out: Output2D,
    index: number
  }[],
  options: any[] // To get the offsets
) {
  const finalSize = [options[0].constants.hive_output_x, options[0].constants.hive_output_y];
  let finalOutput: number[][] = new Array(finalSize[1]) // arr[y][x] always

  for (let i = 0; i < finalSize[1]; i++) { // Fill with 0 placeholders
    finalOutput.push(new Array(finalSize[0]).fill(0))
  }

  outputs.forEach(output => {
    const offsets = [
      options[output.index].constants.hive_offset_x,
      options[output.index].constants.hive_offset_y
    ]

    for (let y in output.out) {  // To support iterable arrays as well as objects
      for (let x in output.out[y]) {
        const X = Number(x);
        const Y = Number(y);
       
        finalOutput[Y + offsets[1]][X + offsets[0]] = output.out[y][x];
      }
    }
  })
  
  return finalOutput as number[][];
}
