import test from 'tape';

const generateOptions = require('../../../dist/util/generateOptions/generateOptions').default;

const initial1DOptions = {
  output: [10],
  constants: {
    hi: 2,
    bye: 3
  }
}

const expected1DOptions = [
  {
    opts: [
      { output: [ 4 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_output_x: 10 } },
      { output: [ 3 ], constants: { hi: 2, bye: 3, hive_offset_x: 4, hive_output_x: 10 } },
      { output: [ 3 ], constants: { hi: 2, bye: 3, hive_offset_x: 7, hive_output_x: 10 } }
    ],
    numHelpers: 2
  },
  {
    opts: [
      { output: [ 3 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_output_x: 10 } },
      { output: [ 3 ], constants: { hi: 2, bye: 3, hive_offset_x: 3, hive_output_x: 10 } },
      { output: [ 2 ], constants: { hi: 2, bye: 3, hive_offset_x: 6, hive_output_x: 10 } },
      { output: [ 2 ], constants: { hi: 2, bye: 3, hive_offset_x: 8, hive_output_x: 10 } }
    ],
    numHelpers: 3
  }
]

test('Correct individual 1D options should be generated', t => {
  for (let expectedOpts of expected1DOptions) {
    t.deepEqual(generateOptions(initial1DOptions, expectedOpts.numHelpers, 1), expectedOpts.opts, `1-D options with ${expectedOpts.numHelpers} helpers`)
  }

  t.end();
})

const initial2DOptions = {
  output: [100, 159],
  constants: {
    hi: 2,
    bye: 3
  }
}

const expected2DOptions = [
  {
    opts: [
      { output: [ 50, 79 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 79 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } }
      ],
    numHelpers: 3
  },
  {
    opts: [
      { output: [ 50, 39 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 40 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 39, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 79 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } }
    ],
    numHelpers: 4
  },
  {
    opts: [
      { output: [ 50, 39 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 40 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 39, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 39 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 0, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 40 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 39, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 0, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } },
      { output: [ 50, 80 ], constants: { hi: 2, bye: 3, hive_offset_x: 50, hive_offset_y: 79, hive_output_x: 100, hive_output_y: 159 } }
    ],
    numHelpers: 5
  }
]

test('Correct individual 2D options should be generated', t => {
  for (let expectedOpts of expected2DOptions) {
    t.deepEqual(generateOptions(initial2DOptions, expectedOpts.numHelpers, 2), expectedOpts.opts, `2-D options with ${expectedOpts.numHelpers} helpers`)
  }

  t.end();
})
