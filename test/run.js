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
  
  hiveRun({
    gpu,
    func: kernelFunc,
    kernelOptions: kernelOptions1D, 
    onWaitingForHelpers: url => {
      hiveHelp({
        gpu,
        url,
        logFunction: (logs) => null
      }) // self help
    },
    doContinueOnHelperJoin: numHelpers => numHelpers >= 1,
    logFunction: () => null, // Don't log anything 
    cb: hiveOutput => {
      t.deepEqual(hiveOutput, localOutput1D, '1D output matches');

      const localOutput2D = Array.from(gpu.createKernel(kernelFunc, kernelOptions2D)(a));
      localOutput2D.forEach((out, i) => localOutput2D[i] = Array.from(out))
  
      hiveRun({
        gpu,
        func: kernelFunc,
        kernelOptions: kernelOptions2D, 
        onWaitingForHelpers: url => {
          hiveHelp({
            gpu,
            url,
            logFunction: (logs) => null
          }) // self help
        },
        doContinueOnHelperJoin: numHelpers => numHelpers >= 1,
        logFunction: () => null, // don't log anything
        cb: hiveOutput => {
          t.deepEquals(hiveOutput, localOutput2D, '2D output matches')
          t.end();
        },
        inputs: [a]
      })
    },
    inputs: [a]
  })
})