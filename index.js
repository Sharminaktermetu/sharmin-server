const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('portfolio');
        const projectsCollection = db.collection('projects');
        const skillsCollection = db.collection('skills');
        
        app.get("/project/:id", async (req, res) => {
            const id = req.params.id;
            const result = await projectsCollection.findOne({ _id: new ObjectId(id) });
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
        
        app.get('/all-skills', async (req, res) => {
          const cursor = skillsCollection.find();
          const skills = await cursor.toArray();
          res.send({ status: true, data: skills });
        });
        
        app.post('/skills', async (req, res) => {
          const skill = req.body;
          const result = await skillsCollection.insertOne(skill);
          res.send(result);
        });

    } finally {
        // Close the MongoDB client connection when the function completes
        client.close();
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

// Export the app as a serverless function for Vercel
module.exports = app;
