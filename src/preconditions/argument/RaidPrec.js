const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class RaidPrec extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'raidprec'
    });
  }

  async run(command, msg, argument, args, value) {
    if (args.raid <= Math.round(NumberUtil.realValue(value.wealth) * 0.4 / 2, 2)) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You are overkilling it. You only need ' + (NumberUtil.realValue(value.wealth) * 0.4 / 2).USD() + ' to steal 40% of their cash that is ' + (NumberUtil.realValue(value.wealth) * 0.4).USD() + '.');
  }
}

module.exports = new RaidPrec();
