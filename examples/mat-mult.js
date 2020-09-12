const { hiveRun } = require('../dist/index');
const { GPU } = require('gpu.js');
const { question } = require('readline-sync');

function generateRandomMatrices(x, y) {
  const M1 = [], M2 = [];

  for (let i = 0; i < y; i++) {
    M1.push([]);
    M2.push([]);

    for (let j = 0; j < x; j++) {
      M1[i].push(Math.random());
      M2[i].push(Math.random());
    }
  }

  return [M1, M2];
}

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
    output: [100, 100]
  },
  onWaitingForHelpers: url => console.log(url),
  doContinueOnHelperJoin: numHelpers => question(`${numHelpers} helpers joined, run the kernel now (y/n)?: `).toLowerCase() == `y`,
  logFunction: console.log, // log function
  cb: output => {
    console.log('Final Output', output);
  },
  inputs: generateRandomMatrices(100, 100)
})