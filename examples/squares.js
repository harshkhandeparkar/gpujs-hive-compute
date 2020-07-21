const { hiveRun } = require('../dist/index').default;
const { GPU } = require('gpu.js');

hiveRun(
  new GPU(),
  function() {
    return this.thread.x ** 2;
  },
  {
    output: [800]
  },
  output => {
    console.log('Final Output', output);
  }
)