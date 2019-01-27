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
    return msg.createReply('add the bot to your server with this link https://discordapp.com/oauth2/authorize?client_id=528623646239883264&scope=bot&permissions=8');
  }
}

module.exports = new Invite();
