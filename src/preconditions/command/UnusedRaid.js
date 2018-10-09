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

    if (gangMembers.some(x => command.cooldowns[x + '-' + msg.guild.id] !== undefined)) {
      return patron.PreconditionResult.fromError(command, 'one of your gang members already used ' + command.names[0] + '.');
    }

    // It works without this loop but without the loop all other members don't have their cd set

    for (let i = 0; i < gangMembers.length; i++) {
      command.cooldowns[gangMembers[i] + '-' + msg.guild.id] = Date.now() + command.cooldown;
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new UnusedRaid();
