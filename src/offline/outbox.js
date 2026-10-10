import { useMemo, useSyncExternalStore } from 'react'
import { offlineStore } from './storage'

// Changes made while offline, kept in this browser until they reach the server (in the order they were made).
// Each id doubles as the idempotency key, so sending one twice never applies it twice.
// item: { id, userId, operation, label, variables, queuedAt, tempId?, error? }
const STORAGE_KEY = 'outbox'
let items = []
const listeners = new Set()

const save = () => offlineStore.setItem(STORAGE_KEY, items).catch(() => {})
const emit = () => listeners.forEach(listener => listener())
const update = (next) => {
  items = next
  emit()
  save()
}

export const loadOutbox = async () => {
  try {
    items = (await offlineStore.getItem(STORAGE_KEY)) || []
  } catch {
    items = []
  }
  emit()
}

export const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`)

export const getOutbox = () => items
export const enqueue = (item) => {
  const entry = { id: newKey(), queuedAt: new Date().toISOString(), error: null, ...item }
  update([...items, entry])
  return entry
}
export const removeItem = (id) => update(items.filter(item => item.id !== id))
export const failItem = (id, error) => update(items.map(item => item.id === id ? { ...item, error } : item))
export const retryItem = (id) => update(items.map(item => item.id === id ? { ...item, error: null } : item))
// After a create syncs, later changes that pointed at its temporary id point at the real one
export const replaceInOutbox = (from, to) => update(items.map(item => ({ ...item, variables: replaceDeep(item.variables, from, to) })))

export function replaceDeep(value, from, to) {
  if (value === from) return to
  if (Array.isArray(value)) return value.map(entry => replaceDeep(entry, from, to))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceDeep(entry, from, to)]))
  return value
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// The signed-in user's waiting and refused changes
// (the same arrays until the outbox changes, so tables keyed on them don't re-render in a loop)
export const useOutbox = (userId) => {
  const all = useSyncExternalStore(subscribe, getOutbox)
  return useMemo(() => {
    const mine = all.filter(item => !userId || !item.userId || item.userId === userId)
    return { all: mine, pending: mine.filter(item => !item.error), failed: mine.filter(item => item.error) }
  }, [all, userId])
}
