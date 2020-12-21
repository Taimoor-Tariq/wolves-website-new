const router = require('express').Router();
const db = require('./database');
const sass = require('sass');
const pug = require('pug');

router.get('/', async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/pug/home_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/sass/home.scss`}).css.toString(),
        CAROUSEL: await db.siteDB.getCarousel(),
        TEAMS: await db.siteDB.getHomePageTeams(),
    }));
});

module.exports = router;