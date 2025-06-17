import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined in .env file');
}
export const client = new MongoClient(uri);