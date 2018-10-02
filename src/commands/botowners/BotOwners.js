const db = require('../../database');
const patron = require('patron.js');

class BotOwners extends patron.Command {
  constructor() {
    super({
      names: ['botowners'],
      groupName: 'botowners',
      description: 'Lists all bot owners.'
    });
  }

  async run(msg, args) {
    const botOwners = await db.botownerRepo.findMany();
    let message = '';

    for (let i = 0; i < botOwners.length; i++) {
      message += await msg.client.users.get(botOwners[i].userId).tag.boldify() + ', ';
    }

    return msg.createReply('Bot owners currently consist of ' + message.substring(0, message.length - 2) + '.');
  }
}

module.exports = new BotOwners();
