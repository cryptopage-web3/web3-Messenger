import { decode, encode, peer } from './peer'

export const channel = new BroadcastChannel('peer:messages')

export const subscribe = DID => {
  peer.pubsub.subscribe(DID, msg => {
    channel.postMessage(decode(msg.data))
    console.log('receive msg: ', decode(msg.data))
  })
  console.log(`message subscribe ${DID}`)
}

export const publish = (DID, message) => {
  peer.pubsub.publish(DID, encode(message))
  console.log(`message publish ${DID}: ${message}`)
}
