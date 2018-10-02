const db = require('../../database');
const patron = require('patron.js');

class RemoveItem extends patron.Command {
  constructor() {
    super({
      names: ['removeitem'],
      groupName: 'owners',
      description: 'Remove a guild item.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'karambit',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Pull('items', { names: args.item.names }));

    const inventory = 'inventory.' + args.item.names[0];

    await db.userRepo.updateMany({ guildId: msg.guild.id }, { $unset: { [inventory]: null }});

    return msg.createReply('You have successfully removed the item ' + args.item.names[0] + '.');
  }
}

module.exports = new RemoveItem();
