import { GPU } from 'gpu.js';

export interface IHiveHelpNonOptionals {
  /** Instance of the gpu.js GPU class */
  gpu: GPU,
  /** Websocket URL, logged by leader */
  url: string
}

export interface IHiveHelpOptionals {
  /** Log function for internal logs, defualt console.log */
  logFunction: (...logs: any) => void
}

export type HiveHelpSettings = IHiveHelpNonOptionals & IHiveHelpOptionals;
export type HiveHelpOptions = IHiveHelpNonOptionals & (IHiveHelpOptionals | {});
