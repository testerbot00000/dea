const db = require('../../database');
const patron = require('patron.js');

class AddItem extends patron.Command {
  constructor() {
    super({
      names: ['additem'],
      groupName: 'owners',
      description: 'Add an item to the guild.',
      args: [
        new patron.Argument({
          name: 'name',
          key: 'names',
          type: 'string',
          preconditions: [{ name: 'maximumlength', options: { length: 24 } }],
          example: 'karambit'
        }),
        new patron.Argument({
          name: 'type',
          key: 'type',
          type: 'type',
          example: 'knife'
        }),
        new patron.Argument({
          name: 'description',
          key: 'description',
          type: 'string',
          preconditions: [{ name: 'maximumlength', options: { length: 42 } }],
          example: 'Use this for killing vim2meta with.',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.items.some((item) => item.names.includes(args.names)) === true) {
      return msg.createErrorReply('This item already exists.');
    }

    args.names = args.names.split(" ");

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Push('items', args));

    return msg.createReply('You have successfully added the item ' + args.names[0] + '.');
  }
}

module.exports = new AddItem();
