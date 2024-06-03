const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('portfolio');
        const projectsCollection = db.collection('projects');
        
        app.get("/project/:id", async (req, res) => {
            const id = req.params.id;
            const result = await collection.findOne({ _id: new ObjectId(id) });
            // console.log(result);
            res.send(result);
          });

        app.get('/all-projects', async (req, res) => {
          
          const cursor = projectsCollection.find();
          const tasks = await cursor.toArray();
          res.send({ status: true, data: tasks });
        });
    
        app.post('/projects', async (req, res) => {
          const task = req.body;
        
          const result = await projectsCollection.insertOne(task);
          res.send(result);
        });

        // ==============================================================
        // WRITE YOUR CODE HERE
        // ==============================================================


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running',
        timestamp: new Date()
    };
    res.json(serverStatus);
});