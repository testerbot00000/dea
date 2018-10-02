const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Wanted extends patron.Command {
  constructor() {
    super({
      names: ['wanted', 'bounties', 'bl', 'bountyleaderboards'],
      groupName: 'general',
      description: 'View the most Targeted Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await db.userRepo.findMany({ guildId: msg.guild.id });

    users.sort((a, b) => b.bounty - a.bounty);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (user === undefined) {
        continue;
      }

      message += (i + 1) + '. ' + user.tag.boldify() + ': ' + NumberUtil.format(users[i].bounty) + '\n';
    }

    if (String.isNullOrWhiteSpace(message) === true) {
      return msg.createErrorReply('There is nobody on the bounty leaderboards yet.');
    }

    return msg.channel.createMessage(message, { title: 'The Most Targeted Traffickers' });
  }
}

module.exports = new Wanted();
