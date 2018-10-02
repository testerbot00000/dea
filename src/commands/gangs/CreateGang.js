const patron = require('patron.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class CreateGang extends patron.Command {
  constructor() {
    super({
      names: ['creategang', 'makegang'],
      groupName: 'gangs',
      description: 'Create a gang.',
      args: [
        new patron.Argument({
          name: 'gang name',
          key: 'gangname',
          type: 'string',
          example: 'Cloud9Swags',
          preconditions: [{ name: 'maximumlength', options: { length: Constants.config.gang.maxChar } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (!/\w/g.test(args.gangname)) {
      return msg.createErrorReply('Your gang\'s name may only contain numbers, and letters.');
    } else if (gang !== null) {
      return msg.createErrorReply('You\'re already in a gang.');
    } else if (NumberUtil.realValue(msg.dbUser.cash) < Constants.config.gang.creationCost) {
      return msg.createErrorReply('You don\'t have enough money to make a gang, it costs ' + Constants.config.gang.creationCost.USD());
    }

    await db.userRepo.modifyCash(msg.dbGuild, msg.member, -Constants.config.gang.creationCost);
    await db.gangRepo.insertGang(msg.author.id, msg.guild.id, args.gangname);
    return msg.createReply('You\'ve successfully created a gang with the name ' + args.gangname.boldify() + '.');
  }
}

module.exports = new CreateGang();
