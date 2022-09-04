const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv=require('dotenv')
const bodyParser = require("body-parser");
app.use(bodyParser.json());
dotenv.config()
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.iumzgaq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const contacts = client.db("contactsDb").collection("contacts");
    app.post("/contact", async (req, res) => {
      const contact = req.body;
      const result = await contacts.insertOne(contact);
      res.send({ data: result, message: "added successfully" });
    });
    app.get("/contacts", async (req, res) => {
      const query = {};
      const result = await contacts.find(query).toArray();
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query={_id: ObjectId(id)}
      const options = { upsert: true };
      const {name, email, number} = req.body;
      const updateDoc = {
        $set: {
         name, email, number
        },
      };
      const result = await contacts.updateOne(query, updateDoc, options)
     res.send(result)
    });
    app.delete('/delete/:id', async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const result=await contacts.deleteOne(query)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
