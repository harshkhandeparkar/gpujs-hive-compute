const { hiveRun } = require('../dist/index');
const { GPU } = require('gpu.js');
const { question, questionInt } = require('readline-sync');

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

function matMultKernel(a, b) {
  let sum = 0;
  for (let i = 0; i < this.output.x; i++) {
    sum += a[this.thread.y][i] * b[i][this.thread.x];
  }
  return sum;
}

const gpu = new GPU();
const matrixDim = questionInt('Matrix Size(nxn)?');
const matrixSize = [matrixDim, matrixDim];
const matrices = generateRandomMatrices(...matrixSize);
const kernelOptions = {
  output: matrixSize
}

console.log(`Multiplying two ${matrixSize[0]}x${matrixSize[1]} matrices both on a hive and a single device.`);

let t = process.hrtime();
const K = gpu.createKernel(matMultKernel, kernelOptions);
K(matrices[0], matrices[1]);
console.log('Single device (local):', (process.hrtime(t)[0] * (10 ** 9) + process.hrtime(t)[1]) / (10**6), 'milliseconds');

hiveRun({
  gpu,
  func: matMultKernel,
  kernelOptions,
  onWaitingForHelpers: url => console.log(url),
  doContinueOnHelperJoin: numHelpers => {
    if (question(`${numHelpers} helpers joined, run the kernel now (y/n)?: `).toLowerCase() == `y`) {
      t = process.hrtime();
      return true;
    }
    else return false;
  },
  logFunction: () => {}, // Do not log anything
  cb: output => {
    console.log('Hive:', (process.hrtime(t)[0] * (10 ** 9) + process.hrtime(t)[1]) / (10**6), 'milliseconds');
  },
  inputs: matrices
})
