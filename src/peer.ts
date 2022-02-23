import * as Ipfs from 'ipfs-core'

const decode = data => new TextDecoder().decode(data)
const encode = data => new TextEncoder().encode(data)

let peer

export const start = async () => {
  peer = await Ipfs.create({
    config: {
      Addresses: {
        Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
      }
    }
  })

  peer.libp2p.on('peer:discovery', (peerId: any) =>
    console.log(`Found peer ${peerId.toB58String()}`)
  )

  peer.libp2p.connectionManager.on('peer:connect', (connection: any) =>
    console.log(`Connected to ${connection.remotePeer.toB58String()}`)
  )

  peer.libp2p.connectionManager.on('peer:disconnect', (connection: any) =>
    console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
  )

  console.log('peer started, ID:', peer.libp2p.peerId.toB58String())

  window.peer = peer
}

start()

const channel = new BroadcastChannel('peer')

export const subscribe = DID => {
  peer.pubsub.subscribe(DID, msg => {
    channel.postMessage(decode(msg.data))
    console.log('receive msg: ', decode(msg.data))
  })
  console.log(`subscribed to ${DID}`)
}

export const publish = (DID, message) => {
  peer.pubsub.publish(DID, encode(message))
  console.log(`Sended to ${DID}: ${message}`)
}
