const patron = require('patron.js');
const db = require('../../database');

class SetGlobalMultiplier extends patron.Command {
  constructor() {
    super({
      names: ['setglobalmultiplier', 'setmessagemultiplier'],
      groupName: 'owners',
      description: 'Sets the global multiplier for money per message.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'float',
          example: '5'
        })
      ]
    });
  }

  async run(msg, args) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'settings.messageMultiplier': args.amount } });
    return msg.createReply('You have successfully set the global multiplier to ' + args.amount + '.');
  }
}

module.exports = new SetGlobalMultiplier();
