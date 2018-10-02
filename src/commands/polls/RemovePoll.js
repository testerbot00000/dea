const db = require('../../database');
const patron = require('patron.js');

class RemovePoll extends patron.Command {
  constructor() {
    super({
      names: ['removepoll'],
      groupName: 'polls',
      description: 'Destroy your poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: 'fags',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.author.id !== args.poll.creatorId) {
      return msg.createErrorReply('You\'re not the creator of this poll.');
    }

    await db.pollRepo.deletePoll(args.poll.name, args.poll.creatorId, msg.guild.id);
    return msg.createReply('Successfully destroyed your poll ' + args.poll.name.boldify() + '.');
  }
}

module.exports = new RemovePoll();
