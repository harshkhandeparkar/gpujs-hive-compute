// Check whether local output and hive output are same.
import { hiveRun, hiveHelp } from '../dist/index';
import test from 'tape';
import { GPU, IKernelSettings, KernelFunction } from 'gpu.js';

const gpu = new GPU();

const testCases: {
  [testCaseName: string]: {
    kernel: KernelFunction,
    options: IKernelSettings,
    input: any[]
  }
} = {
  'no arguments 1D': {
    kernel: function() {
      return 25;
    },
    options: {
      output: [24]
    },
    input: []
  },
  'with arguments 1D': {
    kernel: function(x: number) {
      return 25 + x;
    },
    options: {
      output: [34]
    },
    input: [235]
  },
  'with arguments 2D': {
    kernel: function(x: number) {
      return 25 + x;
    },
    options: {
      output: [2, 4]
    },
    input: [235]
  }
}

test('Outputs should be same on the hive and local', async t => {
  for (let testCaseName in testCases) {
    const testCase = testCases[testCaseName];
    const localKernel = gpu.createKernel(testCase.kernel, testCase.options);

    const localOut = Object.values(!(testCase.input.length > 0 ? localKernel(...testCase.input) : localKernel()))

    const hiveOut = await hiveRun({
      gpu,
      func: testCase.kernel,
      kernelOptions: testCase.options,
      onWaitingForHelpers: url => {
        hiveHelp({
          gpu,
          url,
          logFunction: () => {}
        })
      },
      doContinueOnHelperJoin: () => true,
      logFunction: () => {},
      inputs: testCase.input
    })

    t.deepEqual(hiveOut, localOut, testCaseName);
  }

  t.end();
})
