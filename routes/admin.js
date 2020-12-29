const router = require('express').Router(),
    db = require('../database'),
    sass = require('sass'),
    pug = require('pug')


let checkSession = (req, res, next) => {
    if (!req.session || !req.session.user) res.redirect('/login');
    else next();
}


router.get('/', async (req, res) => {
    if (!req.session || !req.session.username) res.redirect('/login');
    else res.redirect('/dashboard');
});


router.get('/dashboard', checkSession, async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/../views/admin/dashboard.pug`, {
        style: sass.renderSync({file: `${__dirname}/../sass/admin/dashboard.scss`}).css.toString(),
        msg: req.query.msg,
        perms: req.session.user,
        active: ""
    }));
});

router.get('/dashboard/:page?', checkSession, async (req, res) => {
    let perms = Object.keys(req.session.user);
    let new_perms = [];
    let prom = perms.map(p => {
        if (!new_perms.includes(p.split('.')[0])) new_perms.push(p.split('.')[0]);
    });

    Promise.all(prom).then(() => {
        if (!new_perms.includes(req.params.page.toUpperCase())) res.redirect('/dashboard');
        else res.send(pug.renderFile(`${__dirname}/../views/admin/dashboard_${req.params.page.toLowerCase()}.pug`, {
            style: sass.renderSync({file: `${__dirname}/../sass/admin/dashboard.scss`}).css.toString(),
            msg: req.query.msg,
            perms: req.session.user,
            active: req.params.page.toUpperCase()
        }));
    })
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
                    db.adminDB.getPerms(req.body.username).then(perms => {
                        req.session.user = perms[0];
                        res.redirect('/dashboard');
                    });
                }
                else res.redirect('/login?msg=Invalid Credentials');
            })
    });


router.get('/*', async (req, res) => {
    res.status(404).send("Error 404: Page not found")
});

module.exports = router;