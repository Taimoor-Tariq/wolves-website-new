require('dotenv-flow').config();
const subdomain = require('express-subdomain');
const express = require('express');
const app = express();

app.use(require('express-session')({ secret: process.env.SESSION_KEY }));
app.use(express.urlencoded( {extended: true} ));
app.use(require('body-parser').json());
app.use(express.static("public"));
app.use(subdomain('admin', require('./routes/admin')));
app.use(subdomain('www', require('./routes/www')));

app.get('/*', (req, res, next) => {
    if (req.subdomains.length == 0) res.redirect(`https://www.${req.hostname}${req.url}`);
    else next();
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})