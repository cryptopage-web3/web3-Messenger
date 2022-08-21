import * as R from 'ramda'
import { ipfs as peer, decode, encode } from './peer'

const STATUS_INTERVAL = 1000

let intervalID

const getChannelName = DID => `${DID}:status`

export const publish = (DID, status = 'online') => {
  intervalID && clearInterval(intervalID)

  intervalID = setInterval(() => {
    //peer.pubsub.publish(getChannelName(DID), encode(status))
  }, STATUS_INTERVAL)
}

const channel = new BroadcastChannel('peer:status')

let contacts = {}

export const subscribe = DID => {
  const intervalID = setInterval(() => {
    if (R.path([DID, 'time'], contacts) + STATUS_INTERVAL * 2 < Date.now()) {
      channel.postMessage({ DID, status: 'offline' })
      console.info('interval', { DID, status: 'offline' })
    }
  }, STATUS_INTERVAL * 2)

  /*
  peer.pubsub.subscribe(getChannelName(DID), msg => {
    contacts = R.assocPath([DID, 'time'], Date.now(), contacts)
    channel.postMessage({ DID, status: decode(msg.data) })
    console.info(
      'status received ',
      { DID, status: decode(msg.data) },
      contacts
    )
  })
  */

  console.log(`status subscribe ${getChannelName(DID)}`)
}
