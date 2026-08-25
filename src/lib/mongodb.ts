import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

console.log('=== MONGODB DEBUG START ===')
console.log(
  'MONGODB_URI env status:',
  uri
    ? `FOUND (starts with: ${uri.substring(0, 15)}...)`
    : '❌ NOT FOUND / UNDEFINED',
)
console.log('NODE_ENV status:', process.env.NODE_ENV)

if (!uri) {
  console.error(
    '❌ ERROR: MONGODB_URI is undefined. Check your .env / .env.local file.',
  )
  throw new Error('Please add MONGODB_URI to your environment variables')
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the value is preserved across hot reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Initializing new MongoClient instance in development mode...')
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((c) => {
        console.log('✅ MongoDB client connected successfully (Development)')
        return c
      })
      .catch((err) => {
        console.error('❌ MongoDB connection failed:', err)
        throw err
      })
  } else {
    console.log('Reusing existing cached MongoClient instance')
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  console.log('Initializing new MongoClient instance in production mode...')
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((c) => {
      console.log('✅ MongoDB client connected successfully (Production)')
      return c
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err)
      throw err
    })
}

export default clientPromise

export async function getDb(): Promise<Db> {
  console.log('Calling getDb()...')
  const client = await clientPromise
  const db = client.db()
  console.log(
    '✅ getDb() successfully retrieved database instance:',
    db.databaseName || '(Default DB)',
  )
  return db
}
