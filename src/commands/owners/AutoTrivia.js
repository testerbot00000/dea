const patron = require('patron.js');
const db = require('../../database');

class AutoTrivia extends patron.Command {
  constructor() {
    super({
      names: ['autotrivia'],
      groupName: 'owners',
      description: 'Toggle auto-trivia.'
    });
  }

  async run(msg, args) {
    let autoTrivia = true;

    if (msg.dbGuild.autoTrivia === true) {
      autoTrivia = false;
    }

    await db.guildRepo.updateGuild(msg.guild.id, { $set: { autoTrivia: autoTrivia } });
    return msg.createReply('You\'ve successfully set this guild\'s auto trivia to **' + autoTrivia + '**.');
  }
}

module.exports = new AutoTrivia();
