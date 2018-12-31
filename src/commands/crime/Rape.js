const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Rape extends patron.Command {
  constructor() {
    super({
      names: ['rape'],
      groupName: 'crime',
      description: 'Rape any user.',
      cooldown: Constants.config.rape.cooldown,
      postconditions: ['reducedcooldown'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Vanalk#1231',
          preconditionOptions: [{ minimum: Constants.config.rape.minimum }],
          preconditions: ['hasminimumcash', 'noself']
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();

    if (roll < Constants.config.rape.odds) {
      const cost = msg.dbUser.cash * Constants.config.rape.cost;

      await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, -cost);

      return msg.createReply('MAYDAY MY NIGGA! **MAYDAY!** ' + args.member.user.tag.boldify() + ' counter-raped you, forcing you to spend ' + NumberUtil.format(cost) + ' on rectal repairs.');
    }

    const dbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    const cost = dbUser.cash * Constants.config.rape.cost;
    const costStr = NumberUtil.format(cost);

    await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, args.member, -cost);
    await args.member.user.tryDM('Listen here bucko, ' + msg.author.tag.boldify() + ' just raped your fucking asshole and forced you to spend ' + costStr + ' on rectal repairs.');

    return msg.createReply('you raped his **GODDAMN ASSHOLE**! ' + args.member.user.tag.boldify() + ' needed to spend ' + costStr + ' just to get his anus working again!');
  }
}

module.exports = new Rape();
