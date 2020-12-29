// TWITCH MODULES
const 
    { ApiClient } = require('twitch'),
    { ClientCredentialsAuthProvider  } = require('twitch-auth'),
    authProvider = new ClientCredentialsAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET),
    apiClient = new ApiClient({ authProvider })

// DB MODULES
const
    sqlite3 = require("sqlite3").verbose(),
    siteDB = new sqlite3.Database("./database/site-data.db"),
    adminDB = new sqlite3.Database("./database/admin-data.db"),
    wolvesDB = new sqlite3.Database("./database/wolves-data.db")

// OTHER MODULES
const
    axios = require('axios'),
    HTML = require('node-html-parser'),
    Cryptr = require('cryptr'),
    cryptr = new Cryptr(process.env.ECRYPT_KEY)


/**
 * Returns the current munber of viewers for the streamer
 * @param {string} id The twitch ID of the streamer
 * @returns Number of viewers
 */
let getViews = (id) => {
    return new Promise(resolve => {
        apiClient.helix.streams.getStreamByUserName(id)
            .then(s => { resolve(s?s._data.viewer_count:0) })
            .catch(() => { resolve(0) })
    })
}

/**
 * Decrypts the password provided
 * @param {string} pass Password you want to decrypt
 */
let decryptPassword = (pass) => { return cryptr.decrypt(pass) }

exports.ecnPassword = (id) => {
    return new Promise(resolve => {
        adminDB.all(`SELECT * FROM 'USERS' WHERE USERNAME='${id}'`, [], (err, res) => {
            if (err || res.length == 0) resolve(false);
            else {
                if (res.length == 0) resolve(false);
                else {
                    let pwd = cryptr.encrypt(res[0].PASSWORD);
                    adminDB.run(`UPDATE 'USERS' SET PASSWORD='${pwd}' WHERE USERNAME='${id}'`, [], (err) => {
                        if (err) resolve(false);
                        else resolve(true);
                    })
                }
            }
        })
    })
}

exports.validateLogin = (user, pass) => {
    return new Promise(resolve => {
        adminDB.all(`SELECT * FROM "USERS" WHERE USERNAME="${user}"`, [], (err, res) => {
            if (err || res.length == 0) resolve(false);
            else {
                let pwd = decryptPassword(`${res[0].PASSWORD}`);
                if (pwd == pass) resolve(true);
                else resolve(false);
            }
        })
    })
}


exports.getStore = () => {
    return new Promise(resolve => {
        axios.get('https://sectorsixapparel.com/collections/wichita-wolves')
            .then(async response => {
                let data = HTML.parse(response.data);
                let res = {};

                let prom = data.querySelector('#product-loop').childNodes.filter(node => node.classNames?node.classNames.includes('product-index'):"").map(c1 => {
                    c1.childNodes.filter(node => node.classNames?node.classNames.includes('product-info'):"").map(c2 => {
                        if (!(c2.querySelector('.prod-title').rawText in res)) res[c2.querySelector('.prod-title').rawText] = {};
                        res[c2.querySelector('.prod-title').rawText]["Price"] = c2.querySelector('.money').rawText;
                        res[c2.querySelector('.prod-title').rawText]["Link"] = `https://sectorsixapparel.com${(c2.childNodes.filter(node => node.rawTagName?node.rawTagName == "a":"")[0]).getAttribute("href")}`;
                    })
                    
                    let key = ((((c1.childNodes.filter(node => node.rawTagName?node.rawTagName == "a":"")[0]).childNodes.filter(node => node.classNames?node.classNames.includes('square-images'):"")[0]).childNodes.filter(node => node.classNames?node.classNames.includes('box-ratio'):"")[0]).childNodes.filter(node => node.classNames?node.classNames.includes('lazyload'):"")[0]).getAttribute("alt");

                    if (!(key in res)) res[key] = {};
                    res[key]["Image"] = `https:${(HTML.parse((((c1.childNodes.filter(node => node.rawTagName?node.rawTagName == "a":"")[0]).childNodes.filter(node => node.classNames?node.classNames.includes('square-images'):"")[0]).childNodes.filter(node => node.rawTagName?node.rawTagName == "noscript":"")[0]).childNodes[0].rawText).childNodes.filter(node => node.rawTagName?node.rawTagName == "img":"")[0]).getAttribute("src")}`;
                })

                Promise.all(prom).then(() => {
                    let final = [];
                    for (var i in res) final.push({
                        title: i,
                        price: res[i].Price,
                        image: res[i].Image,
                        url: res[i].Link,
                    })
                    resolve(final);
                })     
            })
            .catch(() => { resolve([]) })
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
            wolvesDB.all(`SELECT * FROM "TEAMS" WHERE HOME_PAGE=1`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    },

    getStreamers: () => {
        return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "CONTENT_CREATORS" WHERE PLATFORM="Twitch"`, [], (err, res) => {
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
    },

    getPlayers: (team) => {
        return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "PLAYERS" WHERE TEAM_ID="${team}"`, [], (err, res) => {
                if (err) resolve([]);
                else {
                    let prom = res.map(async s => {
                        await this.wolvesDB.getSocials(s.ID).then(socials => {
                            if (socials.length != 0) {
                                delete socials[0].ID;
                                s["SOCIALS"] = socials[0];
                            }
                        })
                    })
    
                    Promise.all(prom).then(() => {
                        res.sort((a, b) => a.ROLE.localeCompare(b.ROLE));
                        resolve(res);
                    })
                };
            })
        })
    },

    getPageInfo: (page) => {
        return new Promise(resolve => {
            switch (page) {
                case "rosters":
                    siteDB.all(`SELECT * FROM "PAGES" WHERE PAGE="ROSTERS"`, [], (err, res) => { resolve(res[0]) });
                    break;

                case "about":
                    siteDB.all(`SELECT * FROM "PAGES" WHERE PAGE="ABOUT"`, [], (err, res) => { resolve(res[0]) });
                    break;

                default:
                    resolve({
                        DESCRIPTION: null,
                        BANNER_IMG: null,
                        HEADER_IMG: null,
                        BODY: null
                    })
                    break;
            }
        })
    }
}


// wolvesDB
exports.wolvesDB = {
    getGames: (name=null) => {
        if (name) return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "GAMES" WHERE NAME="${name}"`, [], (err, res) => {
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
            wolvesDB.all(`SELECT * FROM "SOCIALS" WHERE ID="${id}"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    },

    getTeams: (name=null) => {
        if (name) return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "TEAMS" WHERE NAME="${name}"`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
        else return new Promise(resolve => {
            wolvesDB.all(`SELECT * FROM "TEAMS" ORDER BY NAME ASC`, [], (err, res) => {
                if (err) resolve([]);
                else resolve(res);
            })
        })
    },
}

// adminDB
exports.adminDB = {
    
}