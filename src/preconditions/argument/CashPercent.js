const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class CashPercent extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'cashpercent'
    });
  }

  async run(command, msg, argument, args, value, options) {
    const dbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    const cashValue = NumberUtil.realValue(dbUser.cash);

    if (cashValue * options.percent >= value) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The maximum percent of ' + argument.name + ' is ' + options.percent * 100 + '%, that is ' + (cashValue * options.percent).USD() + '.');
  }
}

module.exports = new CashPercent();
