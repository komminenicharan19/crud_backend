const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json()); 

const CONNECTION_STRING = "mongodb+srv://admin_crud:charan123@cluster0.a7ymmke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "newapp";

const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
let database;

app.use(cors());
app.use(express.json());


async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db(DATABASENAME);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

connectToDatabase();




app.post('/api/crudapp/AddPost', (request, response) => {
  const { topic, content } = request.body;

  if (!topic || !content) {
    return response.status(400).send({ error: 'Topic and content are required' });
  }

  database.collection("newcollection").insertOne({ topic, content }, (error, result) => {
    if (error) {
      return response.status(500).send({ error: 'Error creating post' });
    }
    response.status(201).send({ _id: result.insertedId, topic, content });
  });
});



app.get('/api/crudapp/GetPosts', (request, response) => {
  database.collection("newcollection").find({}).toArray((error,result) => {
    response.send(result);
  });
})


app.delete('/api/crudapp/DeletePost/:id', (request, response) => {
  database.collection("newcollection").deleteOne({
    id:request.query.id
  });
  response.json("Delete Successfully");
})





const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});