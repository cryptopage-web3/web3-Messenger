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
        { name: 'text', keypath: 'text', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } }
      ]
    }
  ]
}
