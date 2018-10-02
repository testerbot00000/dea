const patron = require('patron.js');

class NotNSFW extends patron.Precondition {
  constructor() {
    super({
      name: 'notnsfw'
    });
  }

  async run(command, msg) {
    if (msg.channel.id === msg.dbGuild.channels.NSFW) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must use this command in the set NSFW channel.');
  }
}

module.exports = new NotNSFW();
