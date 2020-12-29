const router = require('express').Router(),
    db = require('../database'),
    sass = require('sass'),
    pug = require('pug')


let checkSession = (req, res, next) => {
    if (!req.session || !req.session.username) res.redirect('/login');
    else next();
}


router.get('/', async (req, res) => {
    if (!req.session || !req.session.username) res.redirect('/login');
    else res.redirect('/dashboard');
});


router.get('/dashboard', checkSession, async (req, res) => {
    res.send("ADMIN DASHBOARD");
});


router.route('/login')
    .get(async (req, res) => {
        res.send(pug.renderFile(`${__dirname}/../views/admin/login_page.pug`, {
            style: sass.renderSync({file: `${__dirname}/../sass/admin/login.scss`}).css.toString(),
            msg: req.query.msg,
        }));
    })
    .post(async (req, res) => {
        if (!req.body.username || !req.body.password) return res.redirect('/');
        db.validateLogin(req.body.username, req.body.password)
            .then(s => {
                if (s) {
                    req.session.username = req.body.username;
                    res.redirect('/dashboard');
                }
                else res.redirect('/login?msg=Invalid Credentials');
            })
    });


router.get('/*', async (req, res) => {
    res.status(404).send("Error 404: Page not found")
});

module.exports = router;