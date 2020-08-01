import WS from 'ws';
import { GPU } from 'gpu.js';

import { runHelper } from './util/runHelper';

/**
 * 
 * @param gpu Instance of GPU.js `GPU` class
 * @param url WebSocket URL e.g: ws://localhost:4532
 * @param logFunction A custom log function
 */
export function hiveHelp(gpu: GPU, url: string, logFunction: Function = console.log) {
  runHelper(WS, gpu, url, logFunction);
}