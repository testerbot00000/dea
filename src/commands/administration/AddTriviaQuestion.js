const patron = require('patron.js');
const db = require('../../database');

class AddTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['addtriviaquestion', 'addtrivia', 'createtriviaquestion', 'createtrivia'],
      groupName: 'administration',
      description: 'Create a trivia question.',
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: 'is john gay',
          preconditions: [{ name: 'maximumlength', options: { length: 32 }}]
        }),
        new patron.Argument({
          name: 'answer',
          key: 'answer',
          type: 'string',
          example: 'yes he is',
          preconditions: [{ name: 'maximumlength', options: { length: 32 }}],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (Object.keys(msg.dbGuild.trivia) > 69) {
      return msg.createErrorReply('This guild has too many trivia questions.');
    }

    const question = 'trivia.' + args.question;

    await db.guildRepo.updateGuild(msg.guild.id, { $set: { [question]: args.answer } });
    return msg.createReply('You\'ve successfully added question **' + args.question + '**.');
  }
}

module.exports = new AddTriviaQuestion();
