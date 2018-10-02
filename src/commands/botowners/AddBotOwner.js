const db = require('../../database');
const patron = require('patron.js');

class AddBotOwner extends patron.Command {
  constructor() {
    super({
      names: ['addbotowner'],
      groupName: 'botowners',
      description: 'Adds a new owner to the bot.',
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
    await db.botownerRepo.insertBotOwner(args.user.id);
    return msg.createReply('Successfully added user ' + args.user.tag.boldify() + ' as a bot owner.');
  }
}

module.exports = new AddBotOwner();
