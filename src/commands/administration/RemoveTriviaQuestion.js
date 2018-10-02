const patron = require('patron.js');
const db = require('../../database');

class RemoveTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['removetriviaquestion', 'removetrivia', 'removequestion'],
      groupName: 'administration',
      description: 'Remove a trivia question.',
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: 'is john gay',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const question = 'trivia.' + args.question;

    await db.guildRepo.updateGuild(msg.guild.id, { $unset: { [question]: "" } });
    return msg.createReply('You\'ve successfully removed question **' + args.question + '**.');
  }
}

module.exports = new RemoveTriviaQuestion();
