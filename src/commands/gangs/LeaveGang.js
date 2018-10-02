const patron = require('patron.js');
const db = require('../../database');

class LeaveGang extends patron.Command {
  constructor() {
    super({
      names: ['leavegang'],
      groupName: 'gangs',
      description: 'Leave\'s gang.'
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (msg.author.id === gang.leaderId) {
      return msg.createErrorReply('You cannot leave you\'re the leader of the gang, please pass membership to another member of the gang or destroy the gang.');
    }

    const leader = msg.client.users.get(gang.leaderId);
    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $pull: { members: msg.author.id } });
    await leader.tryDM(msg.author.tag.boldify() + ' has left your gang ' + gang.name.boldify() + '.', { guild: msg.guild });
    return msg.createReply('You\'ve successfully left ' + gang.name + '.');
  }
}

module.exports = new LeaveGang();
