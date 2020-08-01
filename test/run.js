// Check whether local output and hive output are same.
const { hiveRun, hiveHelp } = require('../dist/index');
const test = require('tape');
const { GPU } = require('gpu.js');

const kernelFunc = function(a) {
  return a[this.thread.x] ** 2;
}

const a = [10, 20, 30, 40, 10, 13, 21, 13.5];
const kernelOptions1D = {
  output: [8]
}

const kernelOptions2D = {
  output: [8, 13]
}

const gpu = new GPU();

test(`Hive output and local output should match`, t => {
  const localOutput1D = Array.from(gpu.createKernel(kernelFunc, kernelOptions1D)(a));
  
  hiveRun(gpu, kernelFunc, kernelOptions1D, 
    url => {
      hiveHelp(gpu, url); // self help
    },
    numHelpers => numHelpers >= 1,
    () => null, // Don't log anything 
    hiveOutput => {
      t.deepEqual(hiveOutput, localOutput1D, '1D output matches');

      const localOutput2D = Array.from(gpu.createKernel(kernelFunc, kernelOptions2D)(a));
      localOutput2D.forEach((out, i) => localOutput2D[i] = Array.from(out))
  
      hiveRun(gpu, kernelFunc, kernelOptions2D, 
        url => {
          hiveHelp(gpu, url); // self help
        },
        numHelpers => numHelpers >= 1,
        () => null, // don't log anything
        hiveOutput => {
          t.deepEquals(hiveOutput, localOutput2D, '2D output matches')
          t.end();
        },
        [a]
      )
    },
    [a]
  )
})