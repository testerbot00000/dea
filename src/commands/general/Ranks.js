const patron = require('patron.js');

class Ranks extends patron.Command {
  constructor() {
    super({
      names: ['ranks'],
      groupName: 'general',
      description: 'View all ranks in this guild.'
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.roles.rank.length === 0) {
      return msg.createErrorReply('There are no rank roles yet!');
    }

    const sortedRanks = msg.dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired);

    let description = '';

    for (let i = 0; i < sortedRanks.length; i++) {
      const rank = msg.guild.roles.get(sortedRanks[i].id);

      description += rank + ': ' + sortedRanks[i].cashRequired.USD() + '\n';
    }

    description += this.addTop(50, msg, description);
    description += this.addTop(25, msg, description);
    description += this.addTop(10, msg, description);

    return msg.channel.createMessage(description, { title: 'Ranks' });
  }

  addTop(numb, msg, description) {
    const topRole = msg.guild.roles.get(msg.dbGuild.roles['top' + numb]);

    if (topRole !== undefined) {
      return topRole + ': Top ' + numb + '\n';
    }

    return '';
  }
}

module.exports = new Ranks();
