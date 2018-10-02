const patron = require('patron.js');
const db = require('../../database');
const ItemService = require('../../services/ItemService.js');

class Eat extends patron.Command {
  constructor() {
    super({
      names: ['eat'],
      groupName: 'items',
      description: 'Eat food in your inventory.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'dab',
          preconditions: ['donthave', { name: 'nottype', options: { types: ['fish', 'meat'] } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { health: args.item.health } });
    const dbUser = await db.userRepo.getUser(msg.author.id, msg.guild.id);
    let reply = '';
    
    if (dbUser.health > 100) {
      await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { health: 100 } });
      const newDbUser = await db.userRepo.getUser(msg.author.id, msg.guild.id);
      reply = 'Health: ' + newDbUser.health;
    } else {
      reply = 'Health: ' + dbUser.health;
    }

    const food = 'inventory.' + args.item.names[0];
    await db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [food]: -1 } });
    return msg.createReply('You ate: ' + ItemService.capitializeWords(args.item.names[0]) + ' increasing your health by ' + args.item.health + '. ' + reply + '.');
  }
}

module.exports = new Eat();
