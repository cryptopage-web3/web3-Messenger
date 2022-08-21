//TODO: if we would like to re-use DB types, should we define them higher in the file/folder structure?!
export type Contact = {
  sender_did: string
  receiver_did: string
  receiver_public_key?: string
  // did: string
  //alias: string TODO: implement for the case when we search by a Wallet Address  (alias - for user, without prefix; while did - for the app, with prefix), check nicknames of Self.id
  // publicEncryptionKey: string
}
