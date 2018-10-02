const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');

class Trivia extends patron.Command {
  constructor() {
    super({
      names: ['trivia'],
      groupName: 'moderation',
      description: 'Send a random trivia question.'
    });
  }

  async run(msg, args) {
    const questions = Object.keys(msg.dbGuild.trivia);

    if (questions.length <= 0) {
      return msg.channel.createErrorReply('This guild has no trivia questions set.');
    }
    
    const question = Random.arrayElement(questions);
    const answerIndex = questions.findIndex(x => x === question);
    const answer = Object.values(msg.dbGuild.trivia)[answerIndex];

    await msg.channel.createMessage(question, { title: 'Trivia!' });

    const result = await msg.channel.awaitMessages((m) => m.content.toLowerCase().includes(answer.toLowerCase()), { time: 90000, maxMatches: 1 });

    if (result.size >= 1) {
      const prize = Random.nextFloat(500, 10000);
      await db.userRepo.modifyCash(msg.dbGuild, result.first().member, prize);
      return msg.channel.createMessage('Congratulations ' + result.first().author.tag.boldify() + ' for winning ' + prize.USD() + ' in trivia!');
    }

    return msg.channel.createMessage('Damn you fuckers were that slow and retarded FINE I\'ll give you the answer it\'s: ' + answer.boldify());
  }
}

module.exports = new Trivia();
