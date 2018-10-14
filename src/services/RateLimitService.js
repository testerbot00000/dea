const Constants = require('../utility/Constants.js');
const RateLimit = require('../structures/RateLimit.js');

class RateLimitService {
  constructor() {
    this.messages = new Map();
  }

  initiate(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const isMessageCooldownOver = !lastMessage || Date.now() - lastMessage.time > Constants.config.misc.rateLimitMessageCooldown;

    if (!isMessageCooldownOver) {
      if (lastMessage.messages > Constants.config.misc.rateLimitMessageAmount) {
        return msg.client.db.blacklistRepo.insertBlacklist(msg.author.id, msg.author.tag, msg.author.displayAvatarURL());
      }
      lastMessage.messages++;
    }

    if (isMessageCooldownOver) {
      return this.messages.set(msg.author.id, new RateLimit());
    }
  }
}

module.exports = new RateLimitService();
