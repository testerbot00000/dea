const patron = require('patron.js');
const db = require('../../database');

class Questions extends patron.Command {
  constructor() {
    super({
      names: ['questions', 'trivias'],
      groupName: 'trivia',
      description: 'See what the trivia questions are.'
    });
  }

  async run(msg, args) {
    let description = '';
    let position = 1;

    for (const key in msg.dbGuild.trivia) {
      description += (position++) + '. ' + key.boldify() + '\n';
      if (description.length > 1024) {
        await msg.author.tryDM(description, { title: 'Trivia Questions' });
        description = '';
      }
    }

    await msg.author.tryDM(description, { title: 'Trivia Questions' });
    return msg.createReply('You\'ve been DM\'d with all trivia questions.');
  }
}

module.exports = new Questions();
