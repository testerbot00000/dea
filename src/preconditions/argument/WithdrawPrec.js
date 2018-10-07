const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class WithdrawPrec extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'withdrawprec'
    });
  }

  async run(command, msg, argument, args, value) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (value <= Math.round(NumberUtil.realValue(gang.wealth) * 0.2, 2)) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You may only withdraw 20% of your gang\'s wealth, that is ' + (NumberUtil.realValue(gang.wealth) * 0.2).USD() + '.');
  }
}

module.exports = new WithdrawPrec();
