const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const ItemService = require('../../services/ItemService.js');

class Trade extends patron.Command {
  constructor() {
    super({
      names: ['trade'],
      groupName: 'items',
      description: 'Trade items with someone.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: '"Blast It Baby#6969"'
        }),
        new patron.Argument({
          name: 'Exchange Amount',
          key: 'amount',
          type: 'int',
          example: '2'
        }),
        new patron.Argument({
          name: 'Exchange Item',
          key: 'item',
          type: 'item',
          example: '"bear grylls meat"'
        }),
        new patron.Argument({
          name: 'Wanted Amount',
          key: 'amount2',
          type: 'int',
          example: '2'
        }),
        new patron.Argument({
          name: 'Wanted Item',
          key: 'item2',
          type: 'item',
          example: '"bear grylls meat"',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const key = Random.nextInt(0, 2147000000).toString();
    const dbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
    const user = await msg.client.users.get(args.member.id);

    if (dbUser.inventory[args.item2.names[0]] === undefined || dbUser.inventory[args.item2.names[0]] <= 0 || dbUser.inventory[args.item2.names[0]] < args.amount2 || dbUser.inventory[args.item2.names[0]] - args.amount2 < 0) {
      return msg.createErrorReply('User doesn\'t enough of this item.');
    } else if (msg.dbUser.inventory[args.item.names[0]] === undefined || msg.dbUser.inventory[args.item.names[0]] <= 0 || msg.dbUser.inventory[args.item.names[0]] < args.amount || msg.dbUser.inventory[args.item.names[0]] - args.amount < 0) {
      return msg.createErrorReply('You don\'t have enough of item.');
    }

    await user.tryDM(msg.author.tag.boldify() + ' is asking to trade you ' + args.amount + ' of ' + ItemService.capitializeWords(args.item.names[0]) + ' for ' + args.amount2 + ' of ' + ItemService.capitializeWords(args.item2.names[0]) + ' reply with "' + key + '" within the next 5 minutes to accept this trade.', { guild: msg.guild });
    await msg.createReply('The user has been informed of this trade.');

    if (leader.dmChannel === null) {
      await leader.createDM();
    }

    const result = await user.dmChannel.awaitMessages((m) => m.author.id === user.id && m.content.includes(key), { time: 300000, maxMatches: 1 });

    if (result.size >= 1) {
      const dbUserNew = await db.userRepo.getUser(args.member.id, msg.guild.id);
      const authorDbUserNew = await db.userRepo.getUser(msg.author.id, msg.guild.id);

      if (dbUserNew.inventory[args.item2.names[0]] === undefined || dbUserNew.inventory[args.item2.names[0]] <= 0 || dbUserNew.inventory[args.item2.names[0]] < args.amount2 || dbUserNew.inventory[args.item2.names[0]] - args.amount2 < 0) {
        return user.tryDM('You don\'t own ' + args.amount2 + ItemService.capitializeWords(args.item2.names[0]) + ' anymore');
      } else if (authorDbUserNew.inventory[args.item.names[0]] === undefined || authorDbUserNew.inventory[args.item.names[0]] <= 0 || authorDbUserNew.inventory[args.item.names[0]] < args.amount || authorDbUserNew.inventory[args.item.names[0]] - args.amount < 0) {
        return user.tryDM(msg.author.tag + ' does not own ' + args.amount + ItemService.capitializeWords(args.item.names[0]) + ' anymore.');
      }

      const exchangedItem = 'inventory.' + args.item.names[0];
      const wantedItem = 'inventory.' + args.item2.names[0];
      await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [exchangedItem]: -args.amount } });
      await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [wantedItem]: args.amount2 } });
      await db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { [wantedItem]: -args.amount2 } });
      await db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { [exchangedItem]: args.amount } });
      await user.tryDM('You\'ve successfully traded with ' + msg.author.tag.boldify() + '.', { guild: msg.guild });
      return msg.author.tryDM('You\'ve successfully traded with ' + user.tag.boldify() + '.', { guild: msg.guild });
    }

    return msg.author.tryDM(user.tag.boldify() + ' didn\'t respond to your trade offer.', { guild: msg.guild });
  }
}

module.exports = new Trade();
