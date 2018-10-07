class PollService {
  async findLatestPoll(guildId, db) {
    const polls = await client.db.pollRepo.findMany({ guildId });

    return polls.length + 1;
  }
}

module.exports = new PollService();
