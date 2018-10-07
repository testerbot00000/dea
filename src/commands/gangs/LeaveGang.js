const patron = require('patron.js');

class LeaveGang extends patron.Command {
  constructor() {
    super({
      names: ['leavegang'],
      groupName: 'gangs',
      description: 'Leave\'s gang.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id === gang.leaderId) {
      return msg.createErrorReply('you cannot leave you\'re the leader of the gang, please pass membership to another member of the gang or destroy the gang.');
    }

    const leader = msg.guild.members.get(gang.leaderId);
    const update = x => new msg.client.db.updates.Pull(x, msg.author.id);

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('members'));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('elders'));
    await leader.tryDM(msg.author.tag.boldify() + ' has left your gang ' + gang.name.boldify() + '.', { guild: msg.guild });

    return msg.createReply('you\'ve successfully left ' + gang.name + '.');
  }
}

module.exports = new LeaveGang();
