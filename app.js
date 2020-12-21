require('dotenv-flow').config();
const express = require('express');
const app = express();

// app.use(require('express-session')({ secret: process.env.SESSION_KEY }));
app.use(express.urlencoded( {extended: true} ));
app.use(require('body-parser').json());
app.use(express.static("public"));
app.use(require('./routes'));

app.listen(3000, () => {
    console.log("Server running on port 3000");
})