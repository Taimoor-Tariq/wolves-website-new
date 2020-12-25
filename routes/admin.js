const router = require('express').Router();
const db = require('../database');
const sass = require('sass');
const pug = require('pug');

router.get('/', async (req, res) => {
    res.send("TEST");
});

module.exports = router;