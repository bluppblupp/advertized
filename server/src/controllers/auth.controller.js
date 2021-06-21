const express = require('express');
const model = require('../model.js');
const db = require('../database');

const router = express.Router();

/**
 * requireAuth is an endpoint guard for logged in users.
 * aka: A middle ware used to limit access to an endpoint to authenticated users
 * @param {Request} req
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  const maybeUser = model.findUser(req.session.userID);

  // "auth" check
  if (maybeUser === undefined) {
    res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
    return;
  }

  next();
};

/**
 * Tells the client if they are in an authenticated user-session.
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.get('/isAuthenticated', (req, res) => {
  const maybeUser = model.findUser(req.session.userID);
  res.status(200).json({
    isAuthenticated: maybeUser !== undefined,
    username: maybeUser !== undefined ? maybeUser.name : 'N/A',
  });
});

router.post('/register', (req, res) => {
  const usernameRegister = req.body.username;
  const emailRegister = req.body.email;
  const firstPasswordRegister = req.body.password;
  const secondPasswordRegister = req.body.password2;

  const sql = 'SELECT username id, password pass FROM userinfo WHERE id = ? and pass  = ?';

  if (usernameRegister.length < 5 || firstPasswordRegister.length < 5) {
    res.sendStatus(401);
  } else if (firstPasswordRegister !== secondPasswordRegister) {
    res.sendStatus(401);
  } else if (!/\d/.test(firstPasswordRegister)) {
    res.sendStatus(401);
  } else if (!/[a-zA-Z]/g.test(usernameRegister) || !/[a-zA-Z]/g.test(firstPasswordRegister)) {
    res.sendStatus(401);
  } else {
    db.serialize(() => {
      db.each('SELECT rowid AS id, username, password FROM userinfo', (err, row) => {
        if (err) { throw new Error(err); }
        console.log(`${row.id}: ${row.info}`);
      });

      db.get(sql, [usernameRegister, firstPasswordRegister], (err, row) => {
        if (err) {
          return console.log('failed');
        }
        if (typeof row !== 'undefined') {
          res.sendStatus(401);
        } else if (firstPasswordRegister === secondPasswordRegister) {
          const insertUser = db.prepare(`INSERT INTO userinfo (username, password, email)VALUES ("${usernameRegister}","${firstPasswordRegister}","${emailRegister}")`);
          insertUser.run();
          insertUser.finalize();
          res.sendStatus(200);
        }

        return row
          ? console.log(row.id, row.pass)
          : console.log(`No user found with the id ${usernameRegister}`);
      });
    });
  }
});


/**
 * Attempts to authenticate the user-session
 * @param {String} req.body.username - The username of the user attempting to authenticate
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post('/authenticate', (req, res) => {
  // TODO: Check if the user actually exists instead of creating a new one
  const usernameinput = req.body.username;
  const passwordinput = req.body.password;
  const sql = 'SELECT username id, password pass FROM userinfo WHERE id = ? and pass  = ?';
  db.serialize(() => {
    db.each('SELECT rowid AS id, username, password FROM userinfo', (err, row) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`${row.id}: ${row.username}: ${row.password}`);
    });
    db.get(sql, [usernameinput, passwordinput], (err, row) => {
      if (err) {
        return console.log('failed');
      }
      console.log(row);
      if (typeof row === 'undefined') {
        res.sendStatus(401);
      } else if (row.id === usernameinput && row.pass === passwordinput) {
        model.addUser(req.body.username, req.session.socketID);
        // Update the userID of the currently active session
        req.session.userID = req.body.username;
        req.session.save((error) => {
          if (error) console.error(error);
          else console.debug(`Saved userID: ${req.session.userID}`);
        });
        // TODO: Only send 200 when the login was successful
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
      return row ? console.log(row.id, row.pass) : console.log(`No user found with the id ${usernameinput}`);
    });
  });
});
module.exports = { router, requireAuth };
