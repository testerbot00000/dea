const db = require('../../database');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class ModifyCash extends patron.Command {
  constructor() {
    super({
      names: ['modifycash'],
      groupName: 'owners',
      description: 'Allows you to modify the cash of any member.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'quantity',
          example: '500'
        }),
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Supa Hot Fire#0911',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const newDbUser = await db.userRepo.modifyCash(msg.dbGuild, args.member, args.amount);

    return msg.createReply('You have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' balance to ' + NumberUtil.format(newDbUser.cash) + '.');
  }
}

module.exports = new ModifyCash();
