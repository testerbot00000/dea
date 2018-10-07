const patron = require('patron.js');

class NoGangArg extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'nogangarg'
    });
  }

  async run(command, msg, argument, args, value) {
    if (String.isNullOrWhiteSpace(value)) {
      const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

      if (gang) {
        return patron.PreconditionResult.fromSuccess(gang);
      }
    }
    return patron.PreconditionResult.fromError(command, 'You aren\'t in a gang so you must specify one.');
  }
}

module.exports = new NoGangArg();
