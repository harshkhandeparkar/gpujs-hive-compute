import { COMM_TYPE, ASK_ACTIONS, TELL_ACTIONS } from '../constants/comm-constants';

export type ASK_DATA = {
  action: ASK_ACTIONS,
  extras?: any
}

export type TELL_DATA = {
  action: TELL_ACTIONS,
  extras?: any
}

export type CONN_DATA = {}

export type MSG = {
  type: COMM_TYPE,
  data: ASK_DATA | TELL_DATA
}

export type RUN_KERNEL_DATA = {
  do: string
  inputs: number[] | number[][] | number[][][]
}

export type BUILD_KERNEL_DATA = {
  do: string,
  kernelFunc: Function,
  kernelOptions: Object
}
