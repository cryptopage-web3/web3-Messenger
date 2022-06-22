import * as R from 'ramda'
import * as server from './server'
import * as peer from './peer'
import * as Bus from './bus'
import * as DB from './db'

export const subscribe = DID => {
  //peer.subscribe(DID)
  server.subscribe(DID)
  console.log(`message subscribe ${DID}`)
}

export const publish = message => {
  try {
    Bus.channel.postMessage(message)
    server.publish(message)
    //peer.publish(message.receiver, message.text)
    console.log('publish message', message)
  } catch (error) {
    console.log('error :>> ', error)
  }
}

export const addMessage = async message => {
  try {
    return DB.addMessage(message)
  } catch (error) {
    console.log('error addMessage :>> ', error)
  }
}

export const getUserMessages = async DID => {
  if (!DID) return []

  try {
    const messages = await DB.getAllMessages()
    return R.filter(
      () => R.propEq('sender', DID) || R.propEq('receiver', DID),
      messages
    )
  } catch (error) {
    console.log('error getUserMessages :>> ', error)
  }
}

export const updateStatus = async data => {
  try {
    return DB.updateStatus(data)
  } catch (error) {
    console.log('error updateStatus :>> ', error)
  }
}

export const addContact = async contact => {
  try {
    return DB.addContact(contact)
  } catch (error) {
    console.log('error addContact :>> ', error)
  }
}

export const getAllContact = async currentDid => {
  try {
    const contacts = await DB.getAllContacts()
    return R.filter(R.propEq('current_did', currentDid), contacts)
  } catch (error) {
    console.log('error getAllContact :>> ', error)
  }
}
