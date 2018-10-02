const patron = require('patron.js');
const db = require('../../database');

class TransferLeadership extends patron.Command {
  constructor() {
    super({
      names: ['transferleadership', 'transferleader'],
      groupName: 'gangs',
      description: 'Transfers leadership of your gang to another gang member.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          preconditions: ['noself'],
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('You cannot transfer gang leadership, since you\'re not leader of it.');
    }

    const user = msg.client.users.get(args.user.id);

    const userGang = await db.gangRepo.findOne( { $or: [{ members: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] } );

    if (userGang === null || userGang.name !== gang.name) {
      return msg.createErrorReply('This user isn\'t in your gang.');
    } else if (args.user.id === gang.leaderId) {
      return msg.createErrorReply('You already own this gang.');
    }

    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $pull: { members: args.user.id } });
    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $push: { members: msg.author.id } });
    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $set: { leaderId: args.user.id } });
    await user.tryDM('You\'ve been transfered leadership of gang ' + gang.name + '.', { guild: msg.guild });
    return msg.createReply('You\'ve successfully transfered gang leadership to ' + args.user.tag.boldify() + '.');
  }
}

module.exports = new TransferLeadership();
