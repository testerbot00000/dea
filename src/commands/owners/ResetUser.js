const db = require('../../database');
const patron = require('patron.js');

class ResetUser extends patron.Command {
  constructor() {
    super({
      names: ['resetuser'],
      groupName: 'owners',
      description: 'Reset any member\'s data.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Jesus Christ#4444',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.userRepo.deleteUser(args.member.id, msg.guild.id);

    return msg.createReply('You have successfully reset all of ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag + '\'s') + ' data.');
  }
}

module.exports = new ResetUser();
