import Dexie from 'dexie-relay'

const dexie = new Dexie({debug: true, version: 1, url: '198.46.188.206:10509', hash: '7e6520e2fe505702ec644226ccb0a8bc467c5a2c', name: 'test', schema: {posts: 'id, stamp, edit, text, list'}, sync: true})

export {dexie}