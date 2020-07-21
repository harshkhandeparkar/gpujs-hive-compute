const { hiveRun } = require('../dist/index').default;

hiveRun(
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