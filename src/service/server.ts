import * as Bus from './bus'

const ws = new WebSocket('wss://msg.crypto.page')

ws.addEventListener('open', () => console.log('!!! WebSocket open'))

export const subscribe = topic => {
  ws.send(JSON.stringify({ type: 'subscribe', topic }))

  ws.addEventListener('message', event =>
    Bus.channel.postMessage(JSON.parse(event.data))
  )
}

export const publish = message => {
  ws.send(JSON.stringify(message))
}
