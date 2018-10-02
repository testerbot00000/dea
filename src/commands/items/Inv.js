const patron = require('patron.js');
const db = require('../../database');
const ItemService = require('../../services/ItemService.js');

class Inv extends patron.Command {
  constructor() {
    super({
      names: ['inv', 'inventory'],
      groupName: 'items',
      description: 'See your inventory.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
    let description = '';
    for (const key in dbUser.inventory) {
      const s = (dbUser.inventory[key] > 1 ? 's' : '');
      description += (dbUser.inventory[key] > 0 ? ItemService.capitializeWords(key) + s + ': ' + dbUser.inventory[key] + '\n' : '');
    }

    if (String.isNullOrWhiteSpace(description)) {
      return msg.channel.createErrorMessage(args.member.user.tag.boldify() + ' has nothing in their inventory.');
    }

    return msg.channel.createMessage(description, { title: args.member.user.tag + '\'s Inventory:' });
  }
}

module.exports = new Inv();
