class RateLimit {
  constructor() {
    this.messages = 0;
    this.time = Date.now();
  }
}

module.exports = RateLimit;
