export enum COMM_TYPE {
  ASK = 'ask',
  TELL = 'tell',
  REQUEST_CONN = 'request_conn'
}

export enum TELL_ACTIONS {
  KERNEL_BUILT = 'kernel_built',
  KERNEL_RUN_DONE = 'kernel_run_done',
  CONN_ACCEPTED = 'conn_accepted'
}
export enum ASK_ACTIONS { BUILD_KERNEL, RUN_KERNEL }
