import standardizeOutput from '../../src/util/standardizeOutput';
import test from 'tape';

test('IKernelXYZ Output size object should be converted to an array', t => {
  const inputOutputPairs = {
    '1D Object': {
      inputSize: { x: 5 },
      outputSize: [ 5 ]
    },
    '2D Object': {
      inputSize: { x: 45, y: 100 },
      outputSize: [ 45, 100 ]
    },
    '3D Object': {
      inputSize: { x: 5, y: 150, z: 300 },
      outputSize: [ 5, 150, 300 ]
    },

    '1D Preformatted': {
      inputSize: [ 25 ],
      outputSize: [ 25 ]
    },
    '2D Preformatted': {
      inputSize: [ 5, 110 ],
      outputSize: [ 5, 110 ]
    },
    '3D Preformatted': {
      inputSize: [ 5, 150, 300 ],
      outputSize: [ 5, 150, 300 ]
    }
  }

  for (let inputType in inputOutputPairs) {
    t.deepEqual(
      standardizeOutput(inputOutputPairs[inputType].inputSize),
      {
        finalOutput: inputOutputPairs[inputType].outputSize,
        dimensions: inputOutputPairs[inputType].outputSize.length
      },
      inputType
    )
  }

  t.end();
})
