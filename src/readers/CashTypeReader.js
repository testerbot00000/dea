const patron = require('patron.js');
const Constants = require('../utility/Constants.js');
const NumberUtil = require('../utility/NumberUtil.js');

class CashTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'cash' });
  }

  async read(command, message, argument, args, input) {
    let value = Number.parseFloat(input);

    if (input.toLowerCase() === 'all') {
      return patron.TypeReaderResult.fromSuccess(NumberUtil.realValue(message.dbUser.cash));
    } else if (Number.isNaN(value) === false) {
      if (input.endsWith('k')) {
        value *= Constants.data.numbers.thousand;
      } else if (input.endsWith('m')) {
        value *= Constants.data.numbers.million;
      } else if (input.endsWith('b')) {
        value *= Constants.data.numbers.billion;
      }

      return patron.TypeReaderResult.fromSuccess(value);
    }

    return patron.TypeReaderResult.fromError(command, 'you have provided an invalid ' + argument.name);
  }
}

module.exports = new CashTypeReader();
