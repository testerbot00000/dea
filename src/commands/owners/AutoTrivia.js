const patron = require('patron.js');

class AutoTrivia extends patron.Command {
  constructor() {
    super({
      names: ['autotrivia'],
      groupName: 'owners',
      description: 'Toggle auto-trivia.'
    });
  }

  async run(msg) {
    const autoTrivia = !msg.dbGuild.autoTrivia;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { autoTrivia } });

    return msg.createReply('you\'ve successfully set this server\'s auto trivia to **' + autoTrivia + '**.');
  }
}

module.exports = new AutoTrivia();
