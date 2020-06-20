const express = require("express");
const Joi = require("joi"); //used for validation
const admin = require("firebase-admin");

const serviceAccount = require("./functions/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nishad-api.firebaseio.com"
});

const app = express();
app.use(express.json());
let db = admin.firestore();

app.post("/add/slip", (req, res) => {
  db.collection("cities")
    .add(req.body)
    .then(ref => {
      res.send(ref.id);
      console.log("Added document with ID: ", ref.id);
    })
    .catch(E => {
      res.status(400).send(E.message);
    });
});
const slipsCollection = "slips";

app.get("/getAll/slip", (req, res) => {
  db.collection(slipsCollection)
    .get()
    .then(snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        data.push(obj);
      });
      return data;
    })
    .then(data => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(201).send("No documents!");
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
      res.status(400).send(err.message);
    });
});

app.get("/get/slip/:id", (req, res) => {
  db.collection(slipsCollection)
    .doc(req.params.id)
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.status(201).send("No such document!");
      } else {
        let item = doc.data();
        item.id = doc.id;
        res.send(item);
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
      res.status(400).send(err.message);
    });
});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
