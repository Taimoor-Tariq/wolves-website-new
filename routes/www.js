const router = require('express').Router(),
    db = require('../database'),
    sass = require('sass'),
    pug = require('pug')

router.get('/', async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/../views/www/home_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/../sass/www/home.scss`}).css.toString(),
        CAROUSEL: await db.siteDB.getCarousel(),
        TEAMS: await db.siteDB.getHomePageTeams(),
        STREAMS: await db.siteDB.getStreamers(),
    }));
});

router.get('/about', async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/../views/www/about_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/../sass/www/about.scss`}).css.toString(),
        PAGE_INFO: await db.siteDB.getPageInfo("about"),
    }))
});

router.get('/rosters/:roster?', async (req, res) => {
    if (req.params.roster) {
        let teamsInfo = await db.wolvesDB.getTeams(req.params.roster);
        if (teamsInfo.length == 0) res.redirect('/rosters')
        else res.send(pug.renderFile(`${__dirname}/../views/www/roster_page.pug`, {
            style: sass.renderSync({file: `${__dirname}/../sass/www/roster.scss`}).css.toString(),
            TEAM_INFO: teamsInfo[0],
            MEMBERS: await db.siteDB.getPlayers(teamsInfo[0].ID),
        }));
    }
    else res.send(pug.renderFile(`${__dirname}/../views/www/rosters_page.pug`, {
        style: sass.renderSync({file: `${__dirname}/../sass/www/rosters.scss`}).css.toString(),
        PAGE_INFO: await db.siteDB.getPageInfo("rosters"),
        TEAMS: await db.wolvesDB.getTeams(),
    }));
});

router.get('/*', async (req, res) => {
    res.status(404).send("Error 404: Page not found")
})

db.updateViews();
setInterval(() => { db.updateViews() }, 10000);

module.exports = router;