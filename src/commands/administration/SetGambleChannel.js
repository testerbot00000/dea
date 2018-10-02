const patron = require('patron.js');
const db = require('../../database');

class SetGambleChannel extends patron.Command {
  constructor() {
    super({
      names: ['setgamblingchannel', 'gamblechannel', 'setgamblechannel', 'setgambling', 'setgamble', 'gamblingchannel'],
      groupName: 'administration',
      description: 'Sets the gambling channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'gambling',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.gamble': args.channel.id } });

    return msg.createReply('You have successfully set the gambling channel to ' + args.channel + '.');
  }
}

module.exports = new SetGambleChannel();
