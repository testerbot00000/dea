const db = require('../database');
const Constants = require('../utility/Constants.js');
const PromiseUtil = require('../utility/PromiseUtil.js');
const Random = require('../utility/Random.js');

module.exports = async (client) => {
  client.setInterval(async () => {
    const guilds = await db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      if (Object.keys(guilds[i].trivia).length <= 0 || guilds[i].autoTrivia === false) {
        continue;
      }

      const guild = client.guilds.get(guilds[i].guildId);

      if (guild.mainChannel === undefined) {
        continue;
      }

      const questions = Object.keys(guilds[i].trivia);
      const question = Random.arrayElement(questions);
      const answerIndex = questions.findIndex(x => x === question);
      const answer = Object.values(guilds[i].trivia)[answerIndex];

      await guild.mainChannel.createMessage(question, { title: 'Trivia!' });

      const result = await guild.mainChannel.awaitMessages((m) => m.content.toLowerCase().includes(answer.toLowerCase()), { time: 90000, maxMatches: 1 });

      if (result.size >= 1) {
        const prize = Random.nextInt(500, 10000);
        await db.userRepo.modifyCash(guilds[i], result.first().member, prize);
        await guild.mainChannel.createMessage('Congratulations ' + result.first().author.tag.boldify() + ' for winning ' + prize.USD() + ' in trivia!');
      }
  
      await guild.mainChannel.createMessage('Damn you fuckers were that slow and retarded FINE I\'ll give you the answer it\'s: ' + answer.boldify());
    }

    await PromiseUtil.delay(15000);
  }, Constants.config.intervals.autoTrivia);
};
