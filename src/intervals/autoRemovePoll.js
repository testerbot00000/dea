const db = require('../database');
const Constants = require('../utility/Constants.js');

module.exports = async (client) => {
  client.setInterval(async () => {
    const polls = await db.pollRepo.findMany();

    for (let i = 0; i < polls.length; i++) {
      const pollLength = polls[i].length;
      const pollCreatedAt = polls[i].createdAt;
      let choices = '';

      if ((Date.now() - pollCreatedAt) - pollLength <= 0) {
        continue;
      }

      await db.pollRepo.deleteById(polls[i]._id);

      const guild = client.guilds.get(polls[i].guildId);

      if (guild === undefined) {
        continue;
      }

      const creator = guild.member(polls[i].creatorId);

      if (creator === null) {
        continue;
      }

      for (const key in polls[i].choices) {
        choices += '`' + key + '` Votes: ' + polls[i].choices[key] + ',\n';
      }

      await creator.user.tryDM(choices + 'Final Poll Results Of ' + polls[i].name + ' Poll In Server ' + guild.name + '.');
    }
  }, Constants.config.intervals.autoRemovePoll);
};
