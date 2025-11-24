const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

const options = {
  maxPoolSize: 10, // connection pool size
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(uri, options);

async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  }
  return client.db(); // default database from URI or specify here
}

module.exports = { connectToDatabase };
