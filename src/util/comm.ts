import WS from 'ws';
import { ASK_DATA, TELL_DATA, MSG } from '../types/types';
import { COMM_TYPE, ASK_ACTIONS, TELL_ACTIONS } from '../constants/comm-constants';

export function ask(ws: WS, data: ASK_DATA) {
  ws.send(JSON.stringify({
    type: COMM_TYPE.ASK,
    data
  }))

  return ws;
}

export function tell(ws: WS, data: TELL_DATA) {
  ws.send(JSON.stringify({
    type: COMM_TYPE.TELL,
    data
  }))

  return ws;
}

export function onAsk(ws: WS, action: ASK_ACTIONS, handler: (data: ASK_DATA) => void) {
  ws.on('message', msgData => {
    const msg: MSG = JSON.parse(msgData as string);

    tell(ws, {
      action: TELL_ACTIONS.CONN_ACCEPTED
    })
    if (msg.type == COMM_TYPE.ASK && msg.data.action == action) {
      handler(msg.data);
    }
  })

  return ws;
}

export function onTell(ws: WS, action: TELL_ACTIONS, handler: (data: TELL_DATA) => void) {
  ws.on('message', msgData => {
    const msg: MSG = JSON.parse(msgData as string);

    if (msg.type == COMM_TYPE.TELL && msg.data.action == action) {
      handler(msg.data);
    }
  })

  return ws;
}

export function onConnect(ws: WS, handler: (ws: WS) => void) {
  ws.on('message', msgData => {
    const msg: MSG = JSON.parse(msgData as string);

    if (msg.type == COMM_TYPE.REQUEST_CONN) {
      handler(ws);
    }
  })

  return ws;
}

export function onDisconnect(ws: WS, handler: (ws: WS) => void) {
  ws.on('close', handler);
  return ws;
}
