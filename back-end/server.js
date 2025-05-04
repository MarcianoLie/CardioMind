const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes.js");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mongoose = require('mongoose');
const session = require('express-session');




dotenv.config();
const app = express();
const port = 8080;
const host = 'localhost';

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5173"], 
  credentials: true
}));

mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASS}@cardiomind.qb0usur.mongodb.net/CardioMind`)
.then(() => console.log('MongoDB connected globally!'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload()); 




app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: false } // Ubah ke `true` kalau pakai HTTPS
  cookie: {
    secure: false, // true kalau pakai https
    maxAge: 1000 * 60 * 60 * 24 // ✅ 1 hari (dalam milidetik)
  }
}));

// app.use(router);

app.use("/api", router);




app.use(express.static(path.join(__dirname, '../front-end/dist')));
app.get('/', (req, res) => {
  res.send('API is running successfully');
});
// console.log("aaa")
// Semua request selain API diarahkan ke index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../front-end/dist/index.html"));
//   console.log(`not a API request`);
// });
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// console.log("bbb")
app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});

