// enhances log messages with timestamps etc
const betterLogging = require('better-logging');

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');
const http = require('http');


console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const imagePath = path.join(__dirname, '..', '..', 'server');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpServer = http.Server(app);
const io = require('socket.io').listen(httpServer); // Creates socket.io app

// Setup middleware
app.use(betterLogging.expressMiddleware(console, {
  ip: { show: true, color: Theme.green.base },
  method: { show: true, color: Theme.green.base },
  header: { show: false },
  path: { show: true },
  body: { show: true },
}));
app.use(express.json()); /*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
  secret: 'Super secret! Shh! Do not tell anyone...',
  resave: true,
  saveUninitialized: true,
});
app.use(session);
io.use(socketIOSession(session, {
  autoSave: true,
  saveUninitialized: true,
}));

// Serve client
app.use(express.static(publicPath));/*

express.static(absolutePathToPublicDirectory)
This will serve static files from the public directory, starting with index.html
*/
app.use(express.static(imagePath));

// Bind REST controllers to /api/*
const auth = require('./controllers/auth.controller.js');
const adverts = require('./controllers/advert.controller.js');

app.use('/api', auth.router);
// All adverts endpoints require the user to be authenticated
// app.use('/api', auth.requireAuth, adverts.router);
app.use('/api', adverts.router);


// Init model
const model = require('./model.js');

model.init({ io });
model.addAdvert('13:00', 'pelle'); // demo call
model.addAdvert('14:00', 'pelle'); // demo call

// Handle connected socket.io sockets
io.on('connection', (socket) => {
  // This function serves to bind socket.io connections to user models

  if (socket.handshake.session.userID
    && model.findUser(socket.handshake.session.userID) !== undefined
  ) {
    // If the current user already logged in and then reloaded the page
    model.updateUserSocket(socket.handshake.session.userID, socket);
  } else {
    socket.handshake.session.socketID = model.addUnregisteredSocket(socket);
    socket.handshake.session.save((err) => {
      if (err) console.error(err);
      else console.debug(`Saved socketID: ${socket.handshake.session.socketID}`);
    });
  }

  socket.on('update-adverts', () => {
    console.log('updating advert list emit');
    io.emit('update-adverts');
  });
});


// Start server
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
