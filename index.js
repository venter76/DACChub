const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();
const crypto = require('crypto');

  

const app = express();
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const bcrypt = require('bcryptjs');


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

const infoSchema = new mongoose.Schema({
  enter: String,
  password: String,
});

const Info = new mongoose.model("Info", infoSchema);

module.exports = Info;


async function createOrUpdateInfo() {

  const enter = process.env.ENTER;
  const password = process.env.PASSWORD;

  


  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Check if Info collection already has an entry
  const info = await Info.findOne({});

  if (info) {
    // Info collection has an entry, update it
    info.enter = enter;
    info.password = hashedPassword;
    await info.save();
  } else {
    // Info collection is empty, create a new entry
    const newInfo = new Info({ enter, password: hashedPassword });
    await newInfo.save();
  }

  console.log('Username and password have been saved to the database.');
}

// Run the function
createOrUpdateInfo().catch(console.error);




app.get('/', (req, res) => {
  res.render('login', { message: '' });
  
});




  app.post('/login', async (req, res) => {
    try {
      const { enter, password } = req.body;
      
      // Fetch the stored Info
      const info = await Info.findOne({});
  
      if (!info) {
        // No Info in database
        return res.status(400).send('No information found in the database.');
      }
  
      if (enter !== info.enter || !(await bcrypt.compare(password, info.password))) {
        // Username or password is incorrect
        return res.status(401).render('login', { message: 'Invalid username or password.' });
      }
  
      // Username and password are correct
      return res.status(200).render('home');
    
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal server error.');
      
    }
  });


app.get('/home', (req, res) => {
    res.render('home');
  });


  app.get('/research', (req, res) => {
    res.render('research');
  });

  app.get('/admin', (req, res) => {
    res.render('admin');
  });

  app.get('/clinical', (req, res) => {
    res.render('clinical');
  });




connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
  });



 


