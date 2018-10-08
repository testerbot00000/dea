const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Investment extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'investment'
    });
  }

  async run(command, msg, argument, args, value) {
    if (String.isNullOrWhiteSpace(value)) {
      return patron.PreconditionResult.fromSuccess();
    }

    const validInvestments = Object.keys(Constants.config.investments);

    if (!validInvestments.includes(value.toLowerCase())) {
      return patron.PreconditionResult.fromError(command, 'you have provided an invalid investment.');
    }

    const investment = validInvestments.find(x => x === value.toLowerCase());

    if (msg.dbUser.investments.includes(investment)) {
      return patron.PreconditionResult.fromError(command, 'you already have ' + investment + '.');
    }

    const cashValue = NumberUtil.realValue(msg.dbUser.cash);
    const investmentObject = Constants.config.investments[investment];

    if (investmentObject.cost > cashValue) {
      return patron.PreconditionResult.fromError(command, 'you need ' + investmentObject.cost.USD() + ' to buy ' + investment + '. Balance: ' + cashValue.USD() + '.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new Investment();
