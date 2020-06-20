const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const functions = require("firebase-functions");
const bodyParser = require("body-parser");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nishad-api.firebaseio.com"
});

const db = admin.firestore();

const app = express();
const main = express();

const slipsCollection = "slips";

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// webApi is your functions name, and you will pass main as a parameter
module.exports.webApi = functions.https.onRequest(main);

app.post("/add/slip", (req, res) => {
  db.collection(slipsCollection)
    .add(req.body)
    .then(ref => {
      res.send(ref.id);
    })
    .catch(E => {
      console.log("Error getting document", E);
      res.status(400).send(E.message);
    });
});

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
  
