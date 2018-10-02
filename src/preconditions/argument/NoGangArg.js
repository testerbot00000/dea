const patron = require('patron.js');
const db = require('../../database');

class NoGangArg extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'nogangarg'
    });
  }

  async run(command, msg, argument, args, value) {
    if (String.isNullOrWhiteSpace(value)) {
      const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
      if (gang !== null) {
        return patron.PreconditionResult.fromSuccess(gang);
      }
    }
    return patron.PreconditionResult.fromError(command, 'You aren\'t in a gang, therefor must specify one.');
  }
}

module.exports = new NoGangArg();
