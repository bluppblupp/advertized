const express = require("express");
const fs = require("fs");
const request = require("request");
const model = require("../model.js");
const db = require("../database");

const router = express.Router();

/**
 * Fetch the list the currently active adverts
 * @returns {void}
 */
router.get("/advertsList", (req, res) => {
  const advertsDB = [];

  const sql = "SELECT * FROM adverts";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
      advertsDB.push(row);
    });
    res.status(200).json({ list: advertsDB });
  });
});

router.post("/advertListUser", (req, res) => {
  const advertsDBUser = [];
  const theUsername = req.session.userID;
  console.log("Entered advertsListUser");
  const sql = "SELECT * FROM adverts";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.username === req.session.userID) {
        advertsDBUser.push(row);
      }
    });
    res.status(200).json({ username: theUsername, list: advertsDBUser });
  });
});

router.post("/advertListCategory", (req, res) => {
  const advertsDBCategory = [];
  console.log("Entered advertsListCategory");

  const sql = "SELECT * FROM adverts";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.item.includes(req.body.search) || req.body.search === null) {
        if (row.category === req.body.category || req.body.category === "All") {
          advertsDBCategory.push(row);
        }
      }
    });
    res.status(200).json({ list: advertsDBCategory });
  });
});

router.post("/removeAdvert", (req, res) => {
  if (req.session.userID === req.body.user) {
    db.serialize(() => {
      const removeAD = db.prepare(
        "DELETE FROM adverts WHERE advertID=? AND username=?",
        req.body.removeAdvert,
        req.session.userID
      );
      removeAD.run();
      removeAD.finalize();
      res.sendStatus(200);
    });
  } else {
    console.log("username didnt match");
    res.sendStatus(403);
  }
});

router.post("/logOutUser", (req, res) => {
  model.removeUser(req.session.userID);
  req.session.destroy();
  res.sendStatus(200);
});

/**
 * Join the specific advert.
 * This will allow the user-session to listen to and post messages in the given advert.
 * @param {String} req.params.advert - The id of the advert you would like to join
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post("/adverts/:advert/join", (req, res) => {
  const adID = req.params.advert;
  console.log("ADID");
  console.log(adID);

  const theAD = [];

  const sql = "Select * FROM adverts WHERE advertID=?";
  db.all(sql, [adID], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log("row in join");
      console.log(row);
      theAD.push(row);
    });
    console.log("printing join ad");
    console.log(theAD);
    res.status(200).json({ list: theAD });
  });
});

router.post("/addAdvert", (req, res) => {
  console.log("req");
  console.log(req.session.userID);
  if (req.session.userID === req.body.user) {
    const d = new Date();
    console.log("BODY");
    console.log(req.body);
    const date = d.toString();

    const download = (url, path, callback) => {
      request.head(url, (err, body) => {
        console.log(err);
        console.log(body);
        request(url).pipe(fs.createWriteStream(path)).on("close", callback);
      });
    };

    const url = req.body.image;
    const path = `images/${date}-${req.session.userID}.png`;

    download(url, path, () => {
      console.log("Done!");
    });
    db.serialize(() => {
      db.each(
        "SELECT rowid AS id, username, password FROM userinfo",
        (err, row) => {
          if (err) {
            throw new Error(err);
          }
          console.log(`${row.id}: ${row.info}`);
        }
      );

      const insertUser = db.prepare(
        `INSERT INTO adverts (username, date, item, description, location, image, price, email, category)VALUES ("${req.session.userID}","${date}","${req.body.item}","${req.body.description}","${req.body.location}","${path}","${req.body.price}","${req.body.email}","${req.body.category}")`
      );
      insertUser.run();
      insertUser.finalize();
      res.sendStatus(200);
    });
  } else {
    console.log("users didnt match");
    res.sendStatus(403);
  }
});

module.exports = { router };
