const { hiveRun } = require('../dist/index');
const { GPU } = require('gpu.js');
const { question } = require('readline-sync');

hiveRun({
  gpu: new GPU(),
  func: function(a, b) {
    let sum = 0;
    for (let i = 0; i < this.output.x; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  },
  kernelOptions: {
    output: [10, 10]
  },
  onWaitingForHelpers: url => console.log(url),
  doContinueOnHelperJoin: numHelpers => question(`${numHelpers} helpers joined, run the kernel now (y/n)?: `).toLowerCase() == `y`,
  logFunction: console.log, // log function
  cb: output => {
    console.log('Final Output', output);
  },
  inputs: [
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ],
    [
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
      [10, 9, 4, 5, 3, 2, 1, 3, 3, 1],
    ]
  ]
})