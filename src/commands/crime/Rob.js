const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Rob extends patron.Command {
  constructor() {
    super({
      names: ['rob'],
      groupName: 'crime',
      description: 'Use your cash to rob a user.',
      cooldown: Constants.config.rob.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          type: 'member',
          key: 'member',
          example: 'ThiccJoe#7777',
          preconditions: ['assignmemberarg']
        }),
        new patron.Argument({
          name: 'resources',
          type: 'quantity',
          key: 'resources',
          example: '500',
          preconditions: ['cash', { name: 'cashpercent', options: { percent: Constants.config.rob.max } }]
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();

    if (roll < Constants.config.rob.odds) {
      await db.userRepo.modifyCash(msg.dbGuild, args.member, -args.resources);
      await db.userRepo.modifyCash(msg.dbGuild, msg.member, args.resources);

      return msg.createReply('Whilst your target was at the bank, you disguised yourself as a clerk and offered to help him with his deposit. Luckily, you managed to snipe some cash from his account and the dude walked away without noticing. You robbed ' + args.resources.USD() + '.');
    }
    await db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.resources);

    return msg.createReply('You snuck up behind the dude at the bank and surprised his fatass. Unfortunately for you, he was a SWAT agent and sent you to jail. You lost all the resources in the process.');
  }
}

module.exports = new Rob();
