const router = require('express').Router();
const db = require('./database');
const sass = require('sass');
const pug = require('pug');

router.get('/', async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/pug/home_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/sass/home.scss`}).css.toString(),
        CAROUSEL: await db.siteDB.getCarousel(),
        TEAMS: await db.siteDB.getHomePageTeams(),
        STREAMS: await db.siteDB.getStreamers(),
    }));
});

router.get('/rosters/:roster?', async (req, res) => {
    if (req.params.roster) {
        let teamsInfo = await db.wolvesDB.getTeams(req.params.roster);
        if (teamsInfo.length == 0) res.redirect('/rosters')
        else res.send(pug.renderFile(`${__dirname}/pug/roster_page.pug`, {
            style: sass.renderSync({file: `${__dirname}/sass/rosters.scss`}).css.toString(),
            TEAM_INFO: await db.wolvesDB.getTeams(req.params.roster),
            MEMBERS: [],
        }));
    }
    else res.send(pug.renderFile(`${__dirname}/pug/rosters_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/sass/rosters.scss`}).css.toString(),
        PAGE_INFO: await db.siteDB.getPageInfo("rosters"),
        TEAMS: await db.wolvesDB.getTeams(),
    }));
});

db.updateViews();
setInterval(() => { db.updateViews() }, 10000);

module.exports = router;