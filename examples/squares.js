const { hiveRun } = require('../dist/index');
const { GPU } = require('gpu.js');
const { question } = require('readline-sync');

hiveRun(
  new GPU(),
  function() {
    return this.thread.x ** 2;
  },
  {
    output: [800]
  },
  url => console.log(url),
  numHelpers => question(`${numHelpers} helpers joined, run the kernel now (y/n)?: `).toLowerCase() == `y`,
  output => {
    console.log('Final Output', output);
  }
)