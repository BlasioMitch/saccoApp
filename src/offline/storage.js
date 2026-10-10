import localforage from 'localforage'

// IndexedDB storage for offline use (the member, transaction and loan lists outgrow localStorage)
export const offlineStore = localforage.createInstance({ name: 'saccoapp', storeName: 'offline' })
