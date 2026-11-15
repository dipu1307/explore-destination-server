

const express = require("express");
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

let destinationCollection;

 async function connectToMongoDB() {
  try {
    await client.connect();
    const db = client.db('wanderlust');
    destinationCollection = db.collection('destinations');

    

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
app.get("/destination", async(req,res) =>{
  const result = await destinationCollection.find().toArray();
  res.json(result);
});

app.post("/destination", async (req, res) => {
  const destinationData = req.body;
  console.log(destinationData);
  const result = await destinationCollection.insertOne(destinationData);
  res.json(result);
});
app.get('/destination/:id', async(req, res)=>{
  const {id} = req.params
  const result = await destinationCollection.findOne({ _id: new ObjectId(id) });
  res.json(result);
})
app.patch('/destination/:id', async (req, res)=>{
  const {id} = req.params
  const updateData = req.body
  const result = await destinationCollection.updateOne(
    {_id: new ObjectId(id)},

    {$set: updateData}
  )
  res.json(result)
})
app.delete('/destination/:id', async(req,res)=>{
  const {id} = req.params
  const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
  res.json(result);
})
// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await client.close();
}

app.get("/", (req, res) => {
  res.send("server is connected");
});
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
});
