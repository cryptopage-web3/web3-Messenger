import * as server from './server'
import * as peer from './peer'
import * as Bus from './bus'

export const subscribe = DID => {
  //peer.subscribe(DID)
  server.subscribe(DID)
  console.log(`message subscribe ${DID}`)
}

export const publish = message => {
  Bus.channel.postMessage(message)
  server.publish(message)
  //peer.publish(message.receiver, message.text)
  console.log('publish message', message)
}
