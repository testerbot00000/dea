const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');

class BotOwner extends patron.Precondition {
  constructor() {
    super({
      name: 'botowner'
    });
  }

  async run(command, msg) {
    const botOwner = await db.botownerRepo.findBotOwner(msg.author.id);

    if (botOwner !== null ||  Constants.data.misc.ownerIds.some((v) => v === msg.author.id)) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must be a bot owner in order to use this command.');
  }
}

module.exports = new BotOwner();
