/**
 * @class User
 */
class User {
  constructor(name) {
    this.socket = null;
    this.socketID = null;
    this.currentAdvert = null;
    this.name = name;
  }
}

module.exports = User;
