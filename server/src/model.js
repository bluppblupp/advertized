const Advert = require("./models/advert.model");
const User = require("./models/user.model");

/**
 * adverts & users are effectively hash maps with the name of the entry serving as a unique key.
 */
let adverts = {};
let users = {};

/**
 * unregisteredSockets is used as a temporary pool of sockets
 * that belonging to users who are yet to login.
 */
let nextUnregisteredSocketID = 0;
let unregisteredSockets = {};

// Will be initialized in the exports.init function
exports.io = undefined;

/**
 * Initialize the model
 * @param { { io: SocketIO.Server} } config - The configurations needed to initialize the model.
 * @returns {void}
 */
exports.init = ({ io }) => {
  exports.io = io;
};

/**
 * Add a socket.io socket to the pool of unregistered sockets
 * @param {SocketIO.Socket} socket - The socket.io socket to add to the pool.
 * @returns {Number} The ID of the socket in the pool of unregistered sockets.
 */
exports.addUnregisteredSocket = (socket) => {
  const socketID = nextUnregisteredSocketID;
  nextUnregisteredSocketID += 1;

  unregisteredSockets[socketID] = socket;
  return socketID;
};
const assignUnregisteredSocket = (socketID) => {
  const socket = unregisteredSockets[socketID];
  unregisteredSockets = Object.keys(unregisteredSockets)
    .filter((sockID) => sockID !== socketID)
    .reduce(
      (res, sockID) => ({ ...res, [sockID]: unregisteredSockets[sockID] }),
      {}
    );

  return socket;
};

/**
 * Creates a user with the given name.
 * @param {String} name - The name of the user.
 * @param {Number} socketID - An optional ID of a socket.io socket in the unregistered sockets pool.
 * @see model.addUnregisteredSocket
 * @returns {void}
 */
exports.addUser = (name, socketID = undefined) => {
  users[name] = new User(name);
  console.log("adding user:");
  if (socketID !== undefined) {
    users[name].socket = assignUnregisteredSocket(socketID);
    users[name].socketID = socketID;
  }
  console.log(users[name].socketID);
};

exports.findUserSocket = (name) => {
  console.log("user socket:");
  const socket = users[name].socketID;
  return socket;
};

/**
 * Updated the socket associated with the user with the given name.
 * @param {String} name - The name of the user.
 * @param {SocketIO.Socket} socket - A socket.io socket.
 * @returns {void}
 */
exports.updateUserSocket = (name, socket) => {
  users[name].socket = socket;
};

/**
 * Returns the user object with the given name.
 * @param {String} name - The name of the user.
 * @returns {User}
 */
exports.findUser = (name) => users[name];

/**
 * Removes the advert object with the matching name.
 * @param {String} name - The name of the advert.
 * @returns {void}
 */
exports.removeUser = (name) => {
  users = Object.values(users)
    .filter((user) => user.name !== name)
    .reduce((res, user) => ({ ...res, [user.name]: user }), {});
};

/**
 * Creates a advert with the given name.
 * @param {String} name - The name of the advert.
 * @returns {void}
 */
exports.addAdvert = (time, admin) => {
  const name = time + admin;
  adverts[name] = new Advert(time, admin);
};

/**
 * Returns all the adverts.
 * @returns {adverts[]}
 */
exports.getAdverts = () => Object.values(adverts);

/**
 * Removes the advert object with the matching name.
 * @param {String} name - The name of the advert.
 * @returns {void}
 */
exports.removeAdvert = (name) => {
  adverts = Object.values(adverts)
    .filter((advert) => advert.name !== name)
    .reduce((res, advert) => ({ ...res, [advert.name]: advert }), {});
};

/**
 * Return the advert object with the matching name.
 * @param {String} name - The name of the advert.
 * @returns {Advert}
 */
exports.findAdvert = (name) => adverts[name];
