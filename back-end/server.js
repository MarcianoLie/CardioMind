const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes.js");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;
const host = '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(router);
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('API is running successfully');
});

app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});