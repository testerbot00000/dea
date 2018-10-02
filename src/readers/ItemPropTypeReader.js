const patron = require('patron.js');
const Constants = require('../utility/Constants.js');

class ItemPropTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'itemprop' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.items.props.includes(input.toLowerCase())) {
      return patron.TypeReaderResult.fromSuccess(input);
    }

    return patron.TypeReaderResult.fromError(command, 'There is no such item prop such as ' + input + ', please use `' + Constants.data.misc.prefix + 'itemprops` to see all the current item properties.');
  }
}

module.exports = new ItemPropTypeReader();
