import * as Ipfs from 'ipfs-core'

export const decode = data => new TextDecoder().decode(data)
export const encode = data => new TextEncoder().encode(data)

export let ipfs

export const subscribe = (topic, fn) => {
  console.log(`! subscribe: ${topic}`)

  return ipfs.pubsub.subscribe(topic, msg => {
    console.log('! receive: ', { topic, message: decode(msg.data) })
    fn && fn(msg)
  })
}

const publish = (topic, message) => {
  console.log('publish', { topic, message })

  return ipfs.pubsub.publish(topic, encode(message))
}

const bootstraps = [
  //'/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
  //'/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt'
  //
  //'/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  //'/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
  //
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
]

var lastAlive = 0 // last keep-alive we saw from a relay
var lastPeer = 0 // last keep-alive we saw from another peer

// check if we're still connected to the circuit relay (not required, but let's us know if we can see peers who may be stuck behind NAT)
function checkalive() {
  const now = new Date().getTime()
  if (now - lastAlive >= 35000) {
    if (now - lastPeer >= 35000) {
      document.getElementById('status-ball').style.color = 'red'
    } else {
      document.getElementById('status-ball').style.color = 'yellow'
    }
    dobootstrap(true) // sometimes we appear to be connected to the bootstrap nodes, but we're not, so let's try to reconnect
  } else {
    document.getElementById('status-ball').style.color = 'lime'
  }
}

// processes a circuit-relay announce over pubsub
async function processAnnounce(addr) {
  me = (await ipfs.id()).id

  if (addr.from == me) return

  addr = new TextDecoder().decode(addr.data)

  if (addr == 'peer-alive') {
    lastPeer = new Date().getTime()
    return
  }

  lastAlive = new Date().getTime()

  if (addr == 'keep-alive') return

  peer = addr.split('/')[9]
  if (peer == me) return

  peers = await ipfs.swarm.peers()
  for (i in peers) {
    if (peers[i].peer == peer) return
  }

  console.log('Attemp to connect ', addr)

  // connection almost always fails the first time, but almost always succeeds the second time, so we do this:
  try {
    await ipfs.swarm.connect(addr)
  } catch (err) {
    console.log(err)
    await ipfs.swarm.connect(addr)
  }
}

var lastBootstrap = 0 // used for tracking when we last attempted to bootstrap (likely to reconnect to a relay)

// if reconnect is true, it'll first attempt to disconnect from the bootstrap nodes
const dobootstrap = async reconnect => {
  const now = new Date().getTime()
  // don't try to bootstrap again if we just tried within the last 60 seconds
  if (now - lastBootstrap < 1000 * 60) return

  lastBootstrap = now
  for (i in bootstraps) {
    console.log('Attempt to connect ', bootstraps[i])
    try {
      if (reconnect) {
        await ipfs.swarm.disconnect(bootstraps[i])
      } else {
        await ipfs.bootstrap.add(bootstraps[i])
      }
      await ipfs.swarm.connect(bootstraps[i])
    } catch (e) {
      console.log('Attempt failed ', bootstraps[i])
      //await ipfs.swarm.connect(bootstraps[i])
    }
  }
}

const config = {
  //repo: 'ok' + Math.random(), // random so we get a new peerid every time, useful for testing
  relay: {
    enabled: true,
    hop: {
      enabled: true
    }
  },
  config: {
    Addresses: {
      Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
    }
    // FIXME Announce: [ '/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt/p2p-circuit' ],
  }
}

const start = async () => {
  ipfs = await Ipfs.create(config)

  ipfs.libp2p.on('peer:discovery', (peerId: any) =>
    console.log(`Found peer ${peerId.toB58String()}`)
  )

  ipfs.libp2p.connectionManager.on('peer:connect', (connection: any) =>
    console.log(`Connected to ${connection.remotePeer.toB58String()}`)
  )

  ipfs.libp2p.connectionManager.on('peer:disconnect', (connection: any) =>
    console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
  )

  console.log('peer started, ID:', ipfs.libp2p.peerId.toB58String())

  window.ipfs = ipfs

  //////////////////
  console.log('!!! start')

  await dobootstrap(false)

  console.log('!!! dobootstrap')

  await subscribe('discochat-' + 'global', msg => console.log('! out msg', msg))

  console.log('!!! subscribe 1')

  // publish and subscribe to keepalive to help keep the sockets open
  await ipfs.pubsub.subscribe('discochat-' + 'keepalive')
  console.log('!!! subscribe 2')

  setInterval(() => publish('1', 'discochat-' + 'keepalive'), 4000)
  console.log('!!! interval 1')

  setInterval(checkalive, 1000)
  console.log('!!! interval 2')

  // process announcements over the relay network, and publish our own keep-alives to keep the channel alive
  await ipfs.pubsub.subscribe('announce-circuit', processAnnounce)
  console.log('!!! subscribe 3')

  setInterval(() => publish('announce-circuit', 'peer-alive'), 15000)
  console.log('!!! interval 3')
}

start()
