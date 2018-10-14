const Constants = require('../utility/Constants.js');

class RateLimitService {
  constructor() {
    this.messages = new Map();
  }

  async initiate(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const isMessageCooldownOver = !lastMessage || Date.now() - lastMessage.time > Constants.config.misc.rateLimitMessageCooldown;

    if (!isMessageCooldownOver) {
      if (lastMessage.messages > 8) {
        return msg.client.db.blacklistRepo.insertBlacklist(msg.author.id, msg.author.tag, msg.author.displayAvatarURL());
      }
      lastMessage.messages++;
    }

    if (isMessageCooldownOver) {
      return this.messages.set(msg.author.id, { messages: 1, time: Date.now() });
    }
  }
}

module.exports = new RateLimitService();
