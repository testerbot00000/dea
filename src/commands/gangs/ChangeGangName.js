const patron = require('patron.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class ChangeGangName extends patron.Command {
  constructor() {
    super({
      names: ['changegangname', 'changegangsname', 'changegangname'],
      groupName: 'gangs',
      description: 'Changes your gang\'s name.',
      args: [
        new patron.Argument({
          name: 'gang name',
          key: 'name',
          type: 'string',
          example: 'Cloud9Swags',
          preconditions: [{ name:'maximumlength', options: { length: Constants.config.gang.maxChar } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
    if (!/\w/g.test(args.name)) {
      return msg.createErrorReply('Your gang\'s name may only contain numbers, and letters.');
    } else if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('You cannot change your gang\'s name you\'re not leader of it.');
    } else if (NumberUtil.realValue(msg.dbUser.cash) < Constants.config.gang.nameChange) {
      return msg.createErrorReply('You don\'t have enough money to change your gang\'s name, it costs ' + Constants.config.gang.nameChange.USD() + '.');
    }

    await db.userRepo.modifyCash(msg.dbGuild, msg.member, -Constants.config.gang.nameChange);
    await db.gangRepo.updateGang(gang.leaderId, gang.guildId, { $set: { name: args.name } });
    return msg.createReply('You\'ve successfully changed your gang\'s name from ' + gang.name + ' to ' + args.name + '.');
  }
}

module.exports = new ChangeGangName();
