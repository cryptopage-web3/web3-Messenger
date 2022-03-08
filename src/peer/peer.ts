import * as Ipfs from 'ipfs-core'

export const decode = data => new TextDecoder().decode(data)
export const encode = data => new TextEncoder().encode(data)

export let peer

const start = async () => {
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
