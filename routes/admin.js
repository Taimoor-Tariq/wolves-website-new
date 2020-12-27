const router = require('express').Router(),
    db = require('../database'),
    sass = require('sass'),
    pug = require('pug')

router.get('/', async (req, res) => {
    res.send("TEST");
});

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) return res.redirect('/');
    db.validateLogin(req.body.username, req.body.password)
        .then(s => res.send(s))
})

module.exports = router;