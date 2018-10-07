const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class ItemProps extends patron.Command {
  constructor() {
    super({
      names: ['itemprop', 'itemproperties', 'itemprops'],
      groupName: 'items',
      description: 'View all item properties.'
    });
  }

  async run(msg) {
    let reply = '';
    const itemProps = Constants.items.props;

    for (let i = 0; i < itemProps.length; i++) {
      reply += '`' + itemProps[i] + '` ';
    }

    return msg.channel.createMessage(reply, { title: 'All Item Properties Within ' + msg.client.user.username + '.' });
  }
}

module.exports = new ItemProps();
