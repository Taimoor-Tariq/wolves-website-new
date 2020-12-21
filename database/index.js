const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider  } = require('twitch-auth');
const authProvider = new ClientCredentialsAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });

const sqlite3 = require("sqlite3").verbose();
const siteDB = new sqlite3.Database("./database/site-data.db");
const wolvesDB = new sqlite3.Database("./database/wolves-data.db");

let getViews = (id) => {
    return new Promise(resolve => {
        apiClient.helix.streams.getStreamByUserName(id)
            .then(s => { resolve(s?s._data.viewer_count:0) })
            .catch(() => { resolve(0) })
    })
}

exports.updateViews = () => {
    wolvesDB.all(`SELECT * FROM "CONTENT_CREATORS" WHERE platform = "Twitch"`, [], (err, res) => {
        res.map(async s => {
            let v = await getViews(s.USERNAME);
            wolvesDB.run(`UPDATE "CONTENT_CREATORS" SET VIEWS = ${v} WHERE ID = "${s.ID}"`)
        })
    })
}

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

    getStreamers: () => {
        return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "CONTENT_CREATORS" WHERE platform = "Twitch"`, [], (err, res) => {
                if (err) resolve([]);
                else {
                    let prom = res.map(async s => {
                        await this.wolvesDB.getSocials(s.ID).then(socials => {
                            delete socials[0].ID;
                            s["SOCIALS"] = socials[0];
                        })
                    })
    
                    Promise.all(prom).then(() => {
                        res.sort((a, b) => parseInt(b.VIEWS) - parseInt(a.VIEWS));
                        resolve([res[0], res[1], res[2]]);
                    })
                };
            })
        })
    }
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
    },

    getSocials: (id) => {
        return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "SOCIALS" WHERE ID = "${id}"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    }
}