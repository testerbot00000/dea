const db = require('../../database');
const patron = require('patron.js');

class ModifyItem extends patron.Command {
  constructor() {
    super({
      names: ['modifyitem'],
      groupName: 'owners',
      description: 'Add an item to the guild.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'karambit'
        }),
        new patron.Argument({
          name: 'prop',
          key: 'prop',
          type: 'itemprop',
          example: 'damage'
        }),
        new patron.Argument({
          name: 'string or int',
          key: 'valuetype',
          type: 'string',
          example: 'string'
        }),
        new patron.Argument({
          name: 'value',
          key: 'value',
          type: 'string',
          example: 'Use this for killing vim2meta with.',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.valuetype !== 'string' && args.valuetype !== 'int') {
      return msg.createErrorReply('You provided an invalid arg string or int.');
    }

    if (args.valuetype === 'int') {
      args.value = Number.parseInt(args.value);
      if (args.value === NaN) {
        return msg.createErrorReply('This is an invalid int value.');
      }
    }

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Pull('items', args.item));

    args.item[args.prop] = args.value;

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Push('items', args.item));

    return msg.createReply('You have successfully modified the item ' + args.item.names[0] + '.');
  }
}

module.exports = new ModifyItem();
