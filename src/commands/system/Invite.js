const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Invite extends patron.Command {
  constructor() {
    super({
      names: ['invite', 'join', 'add'],
      groupName: 'system',
      description: 'Add Bot to your server.',
      usableContexts: [patron.Context.DM, patron.Context.Guild]
    });
  }

  run(msg) {
    return msg.createReply('donating at https://patreon.com/LegacyYT allowing you to add the bot to your server and fully customize it!');
  }
}

module.exports = new Invite();
