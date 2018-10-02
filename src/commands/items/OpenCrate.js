const patron = require('patron.js');
const db = require('../../database');
const ItemService = require('../../services/ItemService.js');
const Constants = require('../../utility/Constants.js');

class OpenCrate extends patron.Command {
  constructor() {
    super({
      names: ['opencrate', 'open'],
      groupName: 'items',
      description: 'Open a crate.',
      cooldown: Constants.config.opencrate.cooldown,
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bronze crate',
          preconditions: ['donthave', { name: 'nottype', options: { types: ['crate'] } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const cases = 'inventory.' + args.item.names[0];
    const item = await ItemService.openCrate(args.item, msg.dbGuild.items);

    if (item === undefined) {
      return msg.createErrorReply('We apologise for this inconvenience the bot had an error, and didn\'t open your case.');
    }

    const gained = 'inventory.' + item.names[0];
    await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [gained]: 1, [cases]: -1 } });
    return msg.createReply('Congrats! You\'ve won a ' + ItemService.capitializeWords(item.names[0]));
  }
}

module.exports = new OpenCrate();
