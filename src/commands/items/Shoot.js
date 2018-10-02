const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const ItemService = require('../../services/ItemService.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Shoot extends patron.Command {
  constructor() {
    super({
      names: ['shoot'],
      groupName: 'items',
      description: 'Shoot a user with specified gun.',
      cooldown: Constants.config.shoot.cooldown,
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
          example: 'intervention',
          preconditions: ['donthave', { name: 'nottype', options: { types: ['gun'] } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const dbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
    const damage = await ItemService.reduceDamage(dbUser, args.item.damage, msg.dbGuild.items);
    const user = await msg.client.users.get(args.member.id);

    if (roll <= args.item.accuracy) {
      if (dbUser.health - damage <= 0) {
        await ItemService.takeInv(msg.author.id, args.member.id, msg.guild.id);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.bounty);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.cash);
        const totalEarning = dbUser.bounty + dbUser.cash;
        await db.userRepo.deleteUser(args.member.id, msg.guild.id);
        await user.tryDM('Unfortunately, you were killed by ' + msg.author.tag.boldify() + '. All your data has been reset.', { guild: msg.guild });
        await msg.createReply('Woah, you just killed ' + args.member.user.tag.boldify() + '. You just earned ' + NumberUtil.format(totalEarning) + ' **AND** their inventory, congrats.');
      } else {
        await db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { health: -damage } });
        const newdbUser = await db.userRepo.getUser(args.member.id, msg.guild.id);
        await user.tryDM(msg.author.tag.boldify() + ' tried to kill you, but nigga you *AH, HA, HA, HA, STAYIN\' ALIVE*. -' + damage + ' health. Current Health: ' + newdbUser.health, { guild: msg.guild });
        await msg.createReply('Nice shot, you just dealt ' + damage + ' damage to ' + args.member.user.tag.boldify() + '.');
      }
    } else {
      await msg.createReply('The nigga fucking dodged the ' + args.item.bullet + ', literally. What in the sac of nuts.');
    }

    return db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [msg.bullet]: -1 } });
  }
}

module.exports = new Shoot();
