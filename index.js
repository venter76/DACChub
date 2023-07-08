const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();

  

const app = express();
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_cluster_url = process.env.DB_CLUSTER_URL;
const db_name = process.env.DB_NAME;
// mongodb+srv://stephenventer47:oliviaventer@cluster2.swytrma.mongodb.net/

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@${db_cluster_url}/${db_name}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB Atlas:', conn.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};


app.get('/', (req, res) => {
    res.render('home');
  });


  app.get('/research', (req, res) => {
    res.render('research');
  });

  app.get('/protocols', (req, res) => {
    res.render('protocols');
  });

  app.get('/clinical', (req, res) => {
    res.render('clinical');
  });




connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
  })