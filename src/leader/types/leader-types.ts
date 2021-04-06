import { GPU, IGPUKernelSettings } from 'gpu.js';

export interface IHiveRunNonOptionals {
  /** Instance of gpu.js GPU class */
  gpu: GPU,
  /** Kernel Function */
  func: Function
}

export interface IHiveRunOptionals {
  /** Port for the websocket server, default: 8782 */
  wsPort: number,
  /** GPU.js kernel options/settings */
  kernelOptions: IGPUKernelSettings,
  /** A callback that is fired once the leader starts and is waiting for helpers to join */
  onWaitingForHelpers: (url: string) => void,
  /** A callback that is fired each time a new helper joins, return true to start running the kernel and false otherwise */
  doContinueOnHelperJoin: (numHelpers: number) => boolean,
  /** A log function for internal logs, default console.log */
  logFunction: (...logs: any) => void,
  /** Inputs for the kernel, an array of arguments. */
  inputs: any[]
}

export type HiveRunSettings = IHiveRunNonOptionals & IHiveRunOptionals;
export type HiveRunOptions = IHiveRunNonOptionals & (IHiveRunOptionals | {});
