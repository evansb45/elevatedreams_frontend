import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

console.log('[dbConnect] MONGODB_URI defined:', !!MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )
}

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function dbConnect() {
  console.log(
    '[dbConnect] Called. Cached conn exists:',
    !!cached.conn,
    'Cached promise exists:',
    !!cached.promise,
  )
  if (cached.conn) {
    console.log('[dbConnect] Using cached database connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }
    console.log('[dbConnect] Initiating new mongoose connection...')
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      console.log('[dbConnect] Mongoose connected successfully!')
      return m
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.error('[dbConnect] Connection failed:', e)
    cached.promise = null
    throw e
  }

  ;(global as any).mongoose = cached
  return cached.conn
}
