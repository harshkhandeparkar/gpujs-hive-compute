import WS from 'ws';
import { GPU } from 'gpu.js';

import { runHelper } from './util/runHelper';
export type hiveHelpOptions = {
  /** Instance of the gpu.js GPU class */
  gpu: GPU,
  /** Websocket URL, logged by leader */
  url: string,
  /** Log function for internal logs, defualt console.log */
  logFunction: (...logs: any) => void
}

export const hiveHelpDefaults = {
  logFunction: console.log
}

/**
 *
 * @param options Options for the hiveHelp method
 */
export async function hiveHelp(options: hiveHelpOptions) {
  options = {
    ...hiveHelpDefaults,
    ...options
  }
  return await runHelper(WS, options.gpu, options.url, options.logFunction);
}
