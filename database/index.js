const dbFile = "./database/sqlite.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

exports.getCarousel = () => {
    return new Promise(resolve => {
        db.all(`SELECT * FROM "SITE.HOME.CAROUSEL"`, [], (err, res) => {
            if (err) resolve([]);
            else resolve(res);
        })
    })
}