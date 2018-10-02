const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');

class OpenAll extends patron.Command {
  constructor() {
    super({
      names: ['openall'],
      groupName: 'items',
      description: 'Open all of a kind of crate.',
      cooldown: Constants.config.opencrate.cooldown,
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bronze crate',
          preconditions: [{ name: 'nottype', options: { types: ['crate'] } }, 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const cases = 'inventory.' + args.item.names[0];
    let reply = '';
    let openAmount = 0;

    if (msg.dbUser.inventory[args.item.names[0]] > 500000) {
      const botLagReply = await msg.createReply('To reduce bot lag, we\'re only opening 500000 of your crates');
      botLagReply.delete(5000);
      openAmount = 500000;
    } else {
      openAmount = msg.dbUser.inventory[args.item.names[0]];
    }
    
    const item = await ItemService.massOpenCrate(openAmount, args.item, msg.dbGuild.items);

    await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [cases]: -openAmount } });

    for (const key in item) {
      const s = (item[key] > 1 ? 's' : '');
      reply += ItemService.capitializeWords(key) + s + ': ' + item[key] + '\n';
      const gained = 'inventory.' + key;
      await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [gained]: item[key] } });
    }

    return msg.channel.createMessage(reply, { title: msg.author.tag + ' has won'});
  }
}

module.exports = new OpenAll();
