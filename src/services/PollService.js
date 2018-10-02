const db = require('../database');

class PollService {
  async findLatestPoll(guildId) {
    const polls = await db.pollRepo.findMany({ guildId: guildId });

    return polls.length + 1;
  }
}

module.exports = new PollService();
