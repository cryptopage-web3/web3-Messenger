import * as Bus from './bus'

let ws: WebSocket
let topics: Set<string> = new Set()

const waitForSocketConnection = (
  socket,
  callback //TODO: some stackoverflow copy-paste :)
) =>
  setTimeout(function () {
    if (socket.readyState === 1) {
      console.log('Connection is made')
      if (callback != null) {
        callback()
      }
    } else {
      console.log('wait for connection...')
      waitForSocketConnection(socket, callback)
    }
  }, 5)

export const publish = (message: string) => {
  waitForSocketConnection(ws, () => {
    ws.send(JSON.stringify(message))
  })
}

export const subscribe = (topic: string) => {
  waitForSocketConnection(ws, () => {
    topics.add(topic)
    ws.send(JSON.stringify({ type: 'subscribe', topic }))
  })
}

const resubscribe = () => topics.forEach(subscribe)

const connect = () => {
  ws = new WebSocket('wss://msg.crypto.page')

  ws.addEventListener('open', () => {
    console.log('!!! Open')
    resubscribe()
  })

  ws.addEventListener('message', event =>
    Bus.channel.postMessage(JSON.parse(event.data))
  )

  ws.addEventListener('close', () => {
    console.log('!!! Close')
    connect()
  })
}

connect()
