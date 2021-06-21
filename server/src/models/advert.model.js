/**
 * @class Advert
 */
class Advert {
  constructor(time, admin) {
    this.name = time + admin;
    this.time = time;
    this.admin = admin;
    this.createdBy = '';
    this.lookedAt = false;
  }

  addMessage(message) {
    this.createdBy = message;
  }

  setLookedAt(looking) {
    this.lookedAt = looking;
  }
}
module.exports = Advert;
