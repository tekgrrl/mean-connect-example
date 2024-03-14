const { MongoClient, ServerApiVersion } = require('mongodb');

// Basic connection to MongoDB Atlas using X.509 certificate and MongoDB X.509 authentication
// Replace the path to the X.509 certificate with the path to your own certificate
credentials = 'X509-cert-5618187502851416559.pem'

require('dotenv').config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// 
(async () => {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');
    // await listDatabases(client).catch(console.error);
    await createListing(client, { name: "Lovely Loft", summary: "A charming loft in Paris" });
    const database = client.db("sample_mflix");
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  } finally {
    await client.close();
  }
})().catch(console.error);

