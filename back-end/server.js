const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes.js");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");




const app = express();
const port = 8080;
const host = 'localhost';

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], 
    credentials: true
  }));
  
app.use(express.static(path.join(__dirname, '../CardioMindRio')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('API is running successfully');
});

app.use(router);

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});


app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});