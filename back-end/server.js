const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes.js");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');





dotenv.config();
const app = express();
const port = 8080;
const host = process.env.HOST || 'localhost';

// Perbaikan CORS - tambahkan domain Vercel
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500", 
  "http://localhost:5173",
  "https://cardiomind.up.railway.app",
  "cardiomind-backend-production.up.railway.app",
  "https://cardio-mind-zl7u.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASS}@cardiomind.qb0usur.mongodb.net/CardioMind`)
.then(() => console.log('MongoDB connected globally!'))
.catch(err => console.error('MongoDB connection error:', err));

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload()); 




app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://root:${process.env.MONGODB_PASS}@cardiomind.qb0usur.mongodb.net/CardioMind`,
    ttl: 14 * 24 * 60 * 60, // 14 hari
    autoRemove: 'native',
    crypto: {
      secret: process.env.MONGO_STORE_SECRET // Gunakan secret berbeda dari SESSION_SECRET
    }
  }),
  resave: false,
  saveUninitialized: false,
  proxy: true, // Penting untuk Railway
  name: 'cardiomind.sid', // Ganti nama cookie
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 hari
    domain: process.env.COOKIE_DOMAIN // '.railway.app' atau domain Anda
  }
}));

// app.use(router);
/////////////
// app.use("/api", router);




// app.use(express.static(path.join(__dirname, '../front-end/dist')));
app.get('/', (req, res) => {
  res.send('API is running successfully');
});
// // console.log("aaa")
// // Semua request selain API diarahkan ke index.html
// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "../front-end/dist/index.html"));
// //   console.log(`not a API request`);
// // });
// app.use((req, res) => {
//   res.status(404).send('404 Not Found');
// });

///////////
// Serve static files dari React
//app.use(express.static(path.join(__dirname, '../front-end/dist')));

// API routes
app.use("/api", router);

// Handle React routing: return index.html untuk semua request yang bukan API
// app.get(/^(?!\/api).*/, (req, res) => { // Abaikan route yang diawali /api
//  res.sendFile(path.join(__dirname, '../front-end/dist/index.html'));
// });

// app.get('*', (req, res) => {
//   if (!req.path.startsWith('/api')) {
//     res.sendFile(path.join(__dirname, '../front-end/dist/index.html'));
//   } else {
//     res.status(404).json({ error: "API route not found" });
//   }
// });

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
