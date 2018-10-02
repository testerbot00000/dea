const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');
const ItemService = require('../../services/ItemService.js');

class Polls extends patron.Command {
  constructor() {
    super({
      names: ['polls'],
      groupName: 'polls',
      description: 'Finds all polls in server.'
    });
  }

  async run(msg, args) {
    const polls = (await db.pollRepo.findMany({ guildId: msg.guild.id })).sort((a, b) => b.index - a.index);
    let message = '';

    for (let i = 0; i < polls.length; i++) {
      message += polls[i].index + '. ' + polls[i].name + '\n';
      if (i === 20) {
        await msg.author.DMFields(['Polls For Server: ' + msg.guild.name, '```\n' + message + '```'], false);
        message = '';
      }
    }

    await msg.author.DMFields(['Polls For Server: ' + msg.guild.name, '```\n' + message + '```'], false);
    return msg.createReply('You have been DMed with all ' + msg.guild.name + ' polls.');
  }
}

module.exports = new Polls();
