const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const ItemService = require('../../services/ItemService.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Stab extends patron.Command {
  constructor() {
    super({
      names: ['stab'],
      groupName: 'items',
      description: 'Stab a user with specified knife.',
      cooldown: Constants.config.stab.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: 'Blast It Baby#6969'
        }),
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'huntsman knife',
          preconditions: ['donthave', { name: 'nottype', options: { types: ['knife'] } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const dbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
    const damage = await ItemService.reduceDamage(dbUser, args.item.damage, msg.dbGuild.items);
    const shotUser = await msg.client.users.get(args.member.id);

    if (roll <= args.item.accuracy) {
      if (dbUser.health - damage <= 0) {
        await ItemService.takeInv(msg.author.id, args.member.id, msg.guild.id);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.bounty);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.cash);
        const totalEarning = dbUser.bounty + dbUser.cash;
        await db.userRepo.deleteUser(args.member.id, msg.guild.id);
        await shotUser.tryDM('Unfortunately, you were killed by ' + msg.author.tag.boldify() + ' using a ' + ItemService.capitializeWords(args.item.names[0]) + '. All your data has been reset.', { guild: msg.guild });
        return msg.createReply('Woah, you just killed ' + args.member.user.tag.boldify() + '. You just earned ' + NumberUtil.format(totalEarning) + ' **AND** their inventory, congrats.');
      }
      await db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { health: -damage } });
      const newdbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
      await shotUser.tryDM(msg.author.tag.boldify() + ' tried to kill you, but nigga you *AH, HA, HA, HA, STAYIN\' ALIVE*. -' + damage + ' health. Current Health: ' + newdbUser.health, { guild: msg.guild });
      return msg.createReply('Just stabbed that nigga in the heart, you just dealt ' + damage + ' damage to ' + args.member.user.tag.boldify() + '.');
    }
    return msg.createReply('This nigga actually did some acrobatics shit and bounced out of the way before you stabbed him.');
  }
}

module.exports = new Stab();
