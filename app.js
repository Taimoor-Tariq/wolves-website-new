require('dotenv-flow').config();
const
    { root, sub } = require('express-sub'),
    express = require('express'),
    app = express()

app.use(require('express-session')({ secret: process.env.SESSION_KEY }))
    .use(express.urlencoded( {extended: true} ))
    .use(require('body-parser').json())
    .use(express.static("public"))
    .use(sub('admin.', require('./routes/admin')))
    .use(sub('www.', require('./routes/www')))
    .use(root(require('./routes/www'), 'localhost'))

app.get('/*', (req, res, next) => {
    if (req.subdomains.length == 0) res.redirect(`https://www.${req.hostname}${req.url}`);
    else next();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
})