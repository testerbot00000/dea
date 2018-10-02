const patron = require('patron.js');
const db = require('../../database');

class KickGangMember extends patron.Command {
  constructor() {
    super({
      names: ['kickgangmember'],
      groupName: 'gangs',
      description: 'Kick\'s a member from your gang.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'member',
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
      return msg.createErrorReply('You cannot kick anyone from your gang, since you\'re not leader of it.');
    }

    const user = msg.client.users.get(args.user.id);

    const userGang = await db.gangRepo.findOne( { $or: [{ members: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] } );

    if (userGang === null || userGang.name !== gang.name) {
      return msg.createErrorReply('This user isn\'t in your gang.');
    }

    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $pull: { members: args.user.id } });
    await user.tryDM('You\'ve been kicked from your gang ' + gang.name.boldify() + '.', { guild: msg.guild });
    return msg.createReply('You\'ve successfully kicked ' + user.tag.boldify() + ' from your gang.');
  }
}

module.exports = new KickGangMember();
