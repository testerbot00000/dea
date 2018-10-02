const patron = require('patron.js');
const db = require('../database');

class PollTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'poll' });
  }

  async read(command, message, argument, args, input) {
    const poll = await db.pollRepo.findOne({ guildId: message.guild.id, index: Number.parseFloat(input) });

    if (poll !== null) {
      return patron.TypeReaderResult.fromSuccess(poll);
    }

    return patron.TypeReaderResult.fromError(command, 'This poll doesn\'t exist.');
  }
}

module.exports = new PollTypeReader();
