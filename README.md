## GPUjs Hive Compute
Use multiple computers on a network to run a single [GPU.js](https://github.com/gpujs/gpu.js) kernel!

Benchmark Results:
![bench](https://files.gitter.im/5cb7663bd73408ce4fbe0054/IUTE/image.png)

### Table of Contents
- [Installation And Usage](#installation-and-usage)
- [API](#api)
- [Caveats](#caveats)
- [License](LICENSE)

### Installation And Usage
#### In NodeJS
The package is available on npm and can be installed using `npm`/`yarn`.
```
npm i gpujs-hive-compute
```
OR
```
yarn add gpujs-hive-compute
```

#### In the browser
See [browser-hive-compute](https://github.com/HarshKhandeparkar/browser-hive-compute).

#### CLI
There is no default CLI for this because building one is really easy. See `examples/squares.js` and `examples/helper-cli.js`.
You can clone the repository, run `yarn install` and `yarn build` and run `node examples/helper-cli.js` to use a simple CLI for Helper. You can use `examples/squares.js` as a template for real CLI usage of the library or use it for testing.

#### Using as a Library
**NOTE:** This library uses Websockets for communication because they are standard, browser-compatible and easy to use.

The library has two core components, the **Helper** and the **Leader**. The *Leader* is the main device which you control and which asks the other connected devices i.e *Helper*s to build and run parts of the kernel. The Leader side code is just like writing any GPU.js kernel, the library handles all the splitting of work between devices. The Helper and Leader can communicate as long as they are on the same local network. (or if the leader's global ip and port are exposed and known)

Example Leader: (This will work with typescript as well)
```js
const { hiveRun } = require('gpujs-hive-compute');
const GPU = require('gpu.js'); // This is required to be installed separately

const gpu = new GPU(); // Instantiate

hiveRun({
  gpu: gpu, // give the GPU object
  func: function(arg1, arg2) {
    return arg1 + arg2; // A normal GPU.js kernel function
  },
  options: {
    output: [20] // Standard GPU.js kernel settings/options
  },
  onWaitingForHelpers: url => console.log(url),
  doContinueOnHelperJoin: (numHelpers) => { // This callback is fired whenever a new helper joins. Return true
    return numHelpers > 3; // If more than 3 helpers join, it will run the kernel and during this time, no new helper can join.
  },
  cb: (output) => {
    console.log(output); // This callback is fired when the final output is generated
  },
  inputs: [ // Inputs for the kernel, leave blank if there are no inputs.
    5, // arg1
    6 // arg2
  ],
})
```
See `examples/squares.js`.

Example Helper: (This will work with typescript as well)
```js
const { hiveHelp } = require('gpujs-hive-compute');
const GPU = require('gpu.js'); // This is required to be installed separately

const gpu = new GPU(); // Instantiate

hiveHelp({
  gpu: gpu,
  url: `ws://192.168.0.10:8782` // This URL will be logged to the console by the Leader and will differ from device to device.
})
```

### API
The library exports the following functions:

#### `hiveRun(options)`
Where options is an object with the following properties:
1. `gpu` (GPU): Instance of a GPU.js [`GPU`](https://github.com/gpujs/gpu.js#gpu-settings) object.
2. `func` (Function): The GPU.js [kernel](https://github.com/gpujs/gpu.js#creating-and-running-functions) function.
3. `kernelOptions` (Object): GPU.js [kernel settings/options](https://github.com/gpujs/gpu.js#gpucreatekernel-settings).
4. `onWaitingForHelpers(url) => void` (Function): A callback that is fired when a the hive is accepting helpers, the only parameter is the join url.
5. `doContinueOnHelperJoin(numHelpers) => boolean` (Function): This is a callback function that is fired whenever a new helper joins. The parameter `numHelpers` is the number of helpers currently active. Return `true` to run the kernel or `false` to wait for more helpers to join. No new helper can join while the kernel is running.
6. `logFunction(...args) => void` (Function): A custom log function if you don't want console logs.  (`console.log` by default)
7. `cb(output) => void` (Function): This callback is fired when the kernel is completely run and the [output](https://github.com/gpujs/gpu.js#creating-and-running-functions) is generated.
8. `inputs` (Array): This is an array of [kernel inputs](https://github.com/gpujs/gpu.js#accepting-input) in the form `[arg1, arg2, arg3]`.

#### `hiveHelp(options)`
Where options is an object with the following properties:
1. `gpu` (GPU): Instance of a GPU.js [`GPU`](https://github.com/gpujs/gpu.js#gpu-settings) object.
2. `url` (string): The [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) URL used by the Leader and Helper to communicate. The URL will be logged to the console by the leader. e.g: `ws://192.168.0.10:8782`.
3. `logFunction(...args) => void` (Function): A custom log function if you don't want console logs.  (`console.log` by default)

### Caveats
The following features of GPU.js are not supported as of now:
- **3-D kernel outputs**: Will be supported soon
- **Graphical Output**: There is no straightforward way of doing this. (Basically impossible)
- [**Pipelining**](https://github.com/gpujs/gpu.js#pipelining): The task is distributed among multiple GPUs so there is no single texture that can be pipelined.
- **Not All Kernel Constants are available**: Kernel constants are supported but the following names are reserved by the library: `hive_offset_x`, `hive_offset_y`, `hive_offset_z`, `hive_output_x`, `hive_output_y` and `hive_output_z`.


****
#### Thank You!
> Open Source by Harsh Khandeparkar
