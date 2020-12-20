const dbFile = "./database/sqlite.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);