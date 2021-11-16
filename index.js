const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware.
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yemeh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function server() {
  try {
    await client.connect();
    console.log("Database connection established");

    const database = client.db("doctors_portal");
    const appointmentCollection = database.collection("appointments");
    const userCollection = database.collection("users");

    // GET appointments
    app.get("/appointments", async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      const cursor = appointmentCollection.find(query);

      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    // POST appointment
    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      console.log("Appointment :", appointment);
      const result = await appointmentCollection.insertOne(appointment);
      res.json(result);
      console.log(result);
    });

    // POST user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("User :", user);
      const result = await userCollection.insertOne(user);
      res.json(result);
      console.log(result);
    });

    // UPSERT google user account

    app.put("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.json(result);
      console.log("Updated user collection");
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      console.log(query);
      const updateDoc = { $set: { role: admin } };
      const result = await userCollection.updateOne(query, updateDoc);
      res.json(result);
    });
  } finally {
  }
}
server().catch((err) => {
  console.log("Error: " + err);
});

app.get("/", (req, res) => {
  res.send("The world is on fire!");
});

app.listen(port, () => {
  console.log(`${process.env.DB_USER} listening on port`, port);
});
