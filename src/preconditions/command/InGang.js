const patron = require('patron.js');
const db = require('../../database');

class InGang extends patron.Precondition {
  constructor() {
    super({
      name: 'ingang'
    });
  }

  async run(command, msg) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
      
    if (gang !== null) {
      return patron.PreconditionResult.fromSuccess();
    }
    
    return patron.PreconditionResult.fromError(command, 'You aren\'t in a gang.');
  }
}

module.exports = new InGang();
