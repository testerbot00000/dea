const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Jump extends patron.Command {
  constructor() {
    super({
      names: ['jump'],
      groupName: 'crime',
      description: 'Jump some trash for cash on the street.',
      cooldown: Constants.config.jump.cooldown
    });
  }

  async run(msg) {
    const prize = Random.nextFloat(Constants.config.jump.min, Constants.config.jump.max);

    await db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

    return msg.createReply(Random.arrayElement(Constants.data.messages.jump).format(prize.USD()));
  }
}

module.exports = new Jump();
