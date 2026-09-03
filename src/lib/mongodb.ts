import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Please add MONGODB_URI to your environment variables')
}

const client = new MongoClient(uri)
const clientPromise: Promise<MongoClient> = client.connect()

export default clientPromise

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise
  return connectedClient.db()
}
