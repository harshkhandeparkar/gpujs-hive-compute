const { runKernel } = require('../dist/index').default;

runKernel(
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