import Dexie from 'relay-dexie'

const dexie = new Dexie({debug: true, version: 1, proto: window.location.protocol, hash: window.location.hostname, name: 'test', schema: {posts: 'iden, stamp, edit, user, text, list, *for, *tags'}, sync: true})

export {dexie}