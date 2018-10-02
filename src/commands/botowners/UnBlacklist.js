const db = require('../../database');
const patron = require('patron.js');

class UnBlacklist extends patron.Command {
  constructor() {
    super({
      names: ['unblacklist', 'removeblacklist'],
      groupName: 'botowners',
      description: 'Remove\'s blacklist on stated user.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'The Devil#6666',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.blacklistRepo.deleteBlacklist(args.user.id);
    return msg.createReply('Successfully removed ' + args.user.tag + '\'s blacklist.');
  }
}

module.exports = new UnBlacklist();
