const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class ItemTypes extends patron.Command {
  constructor() {
    super({
      names: ['itemtypes', 'itemtype'],
      groupName: 'items',
      description: 'View all item types.'
    });
  }

  async run(msg) {
    let reply = '';
    const itemTypes = Constants.items.types;

    for (let i = 0; i < itemTypes.length; i++) {
      reply += '`' + itemTypes[i] + '` ';
    }

    return msg.channel.createMessage(reply, { title: 'All Item Types Within ' + msg.client.user.username + '.' });
  }
}

module.exports = new ItemTypes();
