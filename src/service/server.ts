import * as Bus from './bus'

let ws: WebSocket
let topics: Set<string> = new Set()

//setInterval(() => console.log(Array.from(topics)), 1000)

export const publish = (message: string) => {
  ws.send(JSON.stringify(message))
}

export const subscribe = (topic: string) => {
  topics.add(topic)
  ws.send(JSON.stringify({ type: 'subscribe', topic }))
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
