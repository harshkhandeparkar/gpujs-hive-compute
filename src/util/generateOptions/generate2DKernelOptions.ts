/**
 * We need to distribute the work equally among each helper.
 * We need to evenly split the output 2-D array (matrix) into parts which will each be evaluated by a different helper.
 * This is not the most best algorithm to split the array but it is the best I could come up with as of now.
 * 1. You have a matrix of n*m sides.
 * 2. If it is to be split into more than 1 parts, cut it into half perpendicular to the longest side among n and m
 * 3. If there are more than two, continue step 1 with the two already cut parts considering them as a smaller version of the same problem.
 * (Recurring algorithm)
 * 
 * NOTE: If the number of helpers is not a power of 2 then the splitting won't be completely even.
 */
export default function generate2DKernelOptions(
  initialOptions: any,
  numHelpers: number
) {
  let opts: any[] = [];
  const rows = initialOptions.output[0];
  const cols = initialOptions.output[1];
  
  let generatedParts: {
    size: [number, number],
    offsets: [number, number]
  }[] = [
    {
      size: [rows, cols],
      offsets: [0, 0]
    }
  ] // The split parts of the matrix

  while (generatedParts.length < numHelpers + 1) { // +1 for the leader
    const newParts: {
      size: [number, number],
      offsets: [number, number]
    }[] = [];

    generatedParts.forEach((part, i) => {
      if ((newParts.length + generatedParts.length - i) < numHelpers + 1) { // +1 for the leader
        // This means that new parts are required and hence generate them

        if (part.size[0] < part.size[1]) { // split perpendicular to the longest side
          newParts.push(
            {
              size: [
                part.size[0],
                Math.floor(part.size[1] / 2) // approximately half
              ],
              offsets: part.offsets // offsets do not change for the first part
            },
            {
              size: [
                part.size[0],
                part.size[1] - Math.floor(part.size[1] / 2)
              ],
              offsets: [
                part.offsets[0],
                part.offsets[1] + Math.floor(part.size[1] / 2)
              ]
            }
          )
        }
        else {
          newParts.push(
            {
              size: [
                Math.floor(part.size[0] / 2),
                part.size[1]
              ],
              offsets: part.offsets
            },
            {
              size: [
                part.size[0] - Math.floor(part.size[0] / 2),
                part.size[1]
              ],
              offsets: [
                part.offsets[0] + Math.floor(part.size[0] / 2),
                part.offsets[1]
              ]
            }
          )
        }
      }
      else newParts.push(part);

    })

    generatedParts = newParts;
  }

  generatedParts.forEach(part => {
    opts.push({
      ...initialOptions,
      output: part.size,
      constants: {
        ...initialOptions.constants,
        hive_offset_x: part.offsets[0],
        hive_offset_y: part.offsets[1],
        hive_output_x: initialOptions.output[0],
        hive_output_y: initialOptions.output[1]
      }
    })
  })
  
  return opts;
}