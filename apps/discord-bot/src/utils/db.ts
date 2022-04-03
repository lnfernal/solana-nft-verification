import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}


if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}
const client:MongoClient = new MongoClient(uri||"", options)
const clientPromise = client.connect()
export default clientPromise