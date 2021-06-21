const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = new Database(databasePath);


db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS userinfo (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS adverts (advertID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, date TEXT, item TEXT, description TEXT, location TEXT, image TEXT, price TEXT, email TEXT, category TEXT)');
});

module.exports = db;
