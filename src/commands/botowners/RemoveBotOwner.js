const db = require('../../database');
const patron = require('patron.js');

class RemoveBotOwner extends patron.Command {
  constructor() {
    super({
      names: ['removebotowner'],
      groupName: 'botowners',
      description: 'Removes an owner from the bot.',
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
    await db.botownerRepo.deleteBotOwner(args.user.id);
    return msg.createReply('Successfully removed user ' + args.user.tag.boldify() + ' as a bot owner.');
  }
}

module.exports = new RemoveBotOwner();
