const patron = require('patron.js');
const db = require('../../database');

class PromoteMember extends patron.Command {
  constructor() {
    super({
      names: ['promotemember'],
      groupName: 'gangs',
      description: 'Promotes member in your gang.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'vim2faggotasshole#3630',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('You\'re not the owner of this gang.');
    } else if (msg.author.id === args.member.id) {
      return msg.createErrorReply('You cannot make yourself an elder.');
    } else if (gang.elders.some((v) => v === args.member.id)) {
      return msg.createErrorReply('This member is already an elder.');
    }

    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $push: { elders: args.member.id } });
    await db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $pull: { members: args.member.id } });

    return msg.createReply('You\'ve successfully promoted ' + args.member.user.tag + ' as an elder in your gang.');
  }
}

module.exports = new PromoteMember();
