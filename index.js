const express = require('express')
const cors = require("cors");
const app = express()
require('dotenv').config()

app.use(cors());
app.use(express.json());


const port = 5000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `${process.env.MONGO_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        let userCollection = client.db("CurePoint").collection("users");
        let appointmentCollection = client.db("CurePoint").collection("appointmentBookings");
        let doctorCollection = client.db("CurePoint").collection("doctors");

        // POST USER DATA WHILE REGISTERING 
        app.post("/userRegister", async (req, res) => {
            let user = req.body;
            let result = await userCollection.insertOne(user);
            res.send(result);
        })

        // API TO GET CURRENT USER DATA 
        app.get("/userData/:email", async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email,
            };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // API TO GET ALL USERS 
        app.get("/allUsers", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        // API TO DELETE AN USER  
        app.delete("/deleteUser/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });


        // UPDATE USER STATUS TO MAKE ADMIN 
        app.patch("/makeAdmin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedStatus = {
                $set: {
                    role: "admin"
                },
            };
            const result = await userCollection.updateOne(
                filter,
                updatedStatus,
                options
            );
            res.send(result);
        });

        // POST APPOINTMENT BOOKINGS BY USER 
        app.post("/appointments", async (req, res) => {
            let bookings = req.body;
            let result = await appointmentCollection.insertOne(bookings);
            res.send(result);
        })

        // GET USER APPOINTMENTS BY EMAIL 
        app.get("/userAppointments", async (req, res) => {
            let userEmail = req.query.email;
            let result = await appointmentCollection.find({ email: userEmail }).toArray();
            res.send(result);
        });

        // DELETE USER APPOINTMENTS 
        app.delete("/userAppointment/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await appointmentCollection.deleteOne(query);
            res.send(result);
        });

        //   UPDATE PAID STATUS FOR APPOINTMENTS 
        app.patch("/appointmentStatus/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedStatus = {
                $set: {
                    paymentStatus: "paid"
                },
            };
            const result = await appointmentCollection.updateOne(
                filter,
                updatedStatus,
                options
            );
            res.send(result);
        });

        // POST DOCTORS DATA WHEN ADDING DOCTORS 
        app.post("/addDoctors", async (req, res) => {
            let doctor = req.body;
            let result = await doctorCollection.insertOne(doctor);
            res.send(result);
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Cure Point Server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})