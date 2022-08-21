export const DBConfig = {
  name: 'messenger',
  version: 1.0,
  objectStoresMeta: [
    {
      store: 'messages',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'receiver', keypath: 'receiver', options: { unique: false } },
        { name: 'sender', keypath: 'sender', options: { unique: false } },
        { name: 'messageId', keypath: 'messageId', options: { unique: true } },
        { name: 'text', keypath: 'text', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } }
      ]
    },
    {
      store: 'contacts',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'sender_did',
          keypath: 'sender_did',
          options: { unique: false }
        },
        {
          name: 'receiver_did',
          keypath: 'receiver_did',
          options: { unique: true }
        },
        {
          name: 'receiver_public_key',
          keypath: 'receiver_public_key',
          options: { unique: true }
        }
      ]
    }
  ]
}
