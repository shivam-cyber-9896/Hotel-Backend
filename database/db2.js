const { MongoClient } = require('mongodb');

// ✅ MongoDB Atlas URL — make sure it includes the DB name
const url = 'mongodb+srv://Shivam:maBmoNb3cZzzIkiH@cluster0.36vtj.mongodb.net/my-hotel-backend?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(url);
const dbName = 'my-hotel-backend';

let dbInstance;

async function main() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
  }
  return dbInstance;
}

module.exports = { main };
