// Check whether local output and hive output are same.
const { hiveRun, hiveHelp } = require('../dist/index');
const test = require('tape');
const { GPU } = require('gpu.js');

const kernelFunc = function(a) {
  return a[this.thread.x] ** 2;
}

const a = [10, 20, 30, 40, 10, 13, 21, 13.5];
const kernelOptions = {
  output: [8]
}

const gpu = new GPU();

test(`Hive output and local output should match`, t => {
  const localOutput = Array.from(gpu.createKernel(kernelFunc, kernelOptions)(a));
  
  hiveRun(gpu, kernelFunc, kernelOptions, 
    url => {
      hiveHelp(gpu, url); // self help
    },
    numHelpers => numHelpers >= 1,
    hiveOutput => {
      t.deepEqual(hiveOutput, localOutput, '1D output matches')
      t.end();
    },
    [a]
  )
})