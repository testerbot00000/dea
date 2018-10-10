const patron = require('patron.js');

class UnusedRaid extends patron.Precondition {
  constructor() {
    super({
      name: 'unusedraid'
    });
  }

  async run(command, msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
    const gangMembers = gang.members.concat(gang.elders, gang.leaderId).filter(x => x !== msg.author.id);

    if (gangMembers.some(x => command.cooldowns[x + '-' + msg.guild.id] !== undefined && command.cooldowns[x + '-' + msg.guild.id] - Date.now() > 0)) {
      return patron.PreconditionResult.fromError(command, 'one of your gang members already used ' + command.names[0] + '.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new UnusedRaid();
