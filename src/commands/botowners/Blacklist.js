const db = require('../../database');
const patron = require('patron.js');

class Blacklist extends patron.Command {
  constructor() {
    super({
      names: ['blacklist'],
      groupName: 'botowners',
      description: 'Blacklists user from your server, but doesn\'t ban him.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'Jesus Christ#4444',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.blacklistRepo.insertBlacklist(args.user.id, args.user.tag, args.user.avatarURL);
    await msg.guild.ban(args.user);
    return msg.createReply('Successfully blacklisted user' + args.user.tag + '.');
  }
}

module.exports = new Blacklist();
