require('dotenv-flow').config();
const
    { root, sub } = require('express-sub'),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000

app.use(require('express-session')({ secret: process.env.SESSION_KEY }))
    .use(express.urlencoded( {extended: true} ))
    .use(require('body-parser').json())
    .use(express.static("public"))
    .use(sub('www.', require('./routes/www')))
    .use(sub('admin.', require('./routes/admin')))
    .use(root(require('./routes/www'), 'localhost'))

app.get('/*', (req, res, next) => {
    if (req.subdomains.length == 0) {
        if (req.hostname == "localhost") res.redirect(`http://www.${req.hostname}:${port}${req.url}`);
        else res.redirect(`http://www.${req.hostname}${req.url}`);
    }
    else next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})