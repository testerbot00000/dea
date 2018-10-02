const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');
const ItemService = require('../../services/ItemService.js');

class Shop extends patron.Command {
  constructor() {
    super({
      names: ['shop', 'buy'],
      groupName: 'items',
      description: 'Buy a crate.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bear grylls meat',
          preconditions: [{ name: 'nottype', options: { types: ['crate'] } }]
        }),
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'quantity',
          example: '2',
          defaultValue: 1,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const item = 'inventory.' + args.item.names[0];
    let totalCaseAmount = args.item.price * args.amount;

    if (NumberUtil.realValue(msg.dbUser.cash) < totalCaseAmount) {
      return msg.createErrorReply('You don\'t have enough money to buy ' + (args.amount > 1 ? args.amount + ' ' + args.item.names[0] + 's' : 'a ' + args.item.names[0]) + ', it costs ' + totalCaseAmount.USD() + '.');
    }

    await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [item]: args.amount } });
    await db.userRepo.modifyCash(msg.dbGuild, msg.member, -totalCaseAmount);
    return msg.createReply('You have successfully purchased ' + args.amount + ' of ' + (args.amount > 1 ? args.item.names[0] + 's' : args.item.names[0]) + '.');
  }
}

module.exports = new Shop();
