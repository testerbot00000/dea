const patron = require('patron.js');

class ItemTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'item' });
  }

  async read(command, message, argument, args, input) {
    const item = message.dbGuild.items.find(x => x.names.includes(input.toLowerCase()));

    if (item !== undefined) {
      return patron.TypeReaderResult.fromSuccess(item);
    }

    return patron.TypeReaderResult.fromError(command, 'Guild does not have item ' + input + '.');
  }
}

module.exports = new ItemTypeReader();
