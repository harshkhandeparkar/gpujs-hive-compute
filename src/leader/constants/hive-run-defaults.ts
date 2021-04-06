import { IHiveRunOptionals } from '../types/leader-types';

export const hiveRunDefaults: IHiveRunOptionals = {
  wsPort: 8782,
  kernelOptions: {},
  onWaitingForHelpers: () => {},
  doContinueOnHelperJoin: () => true,
  logFunction: console.log,
  inputs: []
}
