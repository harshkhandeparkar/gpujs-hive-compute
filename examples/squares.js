const { hiveRun } = require('../dist/index');
const { GPU } = require('gpu.js');
const { question } = require('readline-sync');

hiveRun({
  gpu: new GPU(),
  func: function() {
    return this.thread.x ** 2;
  },
  kernelOptions: {
    output: [800]
  },
  onWaitingForHelpers: url => console.log(url),
  doContinueOnHelperJoin: numHelpers => question(`${numHelpers} helpers joined, run the kernel now (y/n)?: `).toLowerCase() == `y`,
  logFunction: console.log, // log function
  cb: output => {
    console.log('Final Output', output);
  }
})