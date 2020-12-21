const sqlite3 = require("sqlite3").verbose();
const siteDB = new sqlite3.Database("./database/site-data.db");
const wolvesDB = new sqlite3.Database("./database/wolves-data.db");

// siteDB
exports.siteDB = {
    getCarousel: () => {
        return new Promise(resolve => {
            siteDB.all(`SELECT * FROM "HOME.CAROUSEL"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    },

    getHomePageTeams: () => {
        return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "TEAMS" WHERE HOME_PAGE = 1`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    },
}


// wolvesDB
exports.wolvesDB = {
    getGames: (name=null) => {
        if (name) return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "GAMES" WHERE NAME = "${name}"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
        else return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "GAMES"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    }
}