const patron = require('patron.js');
const db = require('../../database');

class SetModLog extends patron.Command {
  constructor() {
    super({
      names: ['setmodlog', 'modlog', 'logs', 'setmodlog', 'setmodlogs', 'setlog', 'setlogs'],
      groupName: 'administration',
      description: 'Sets the mod log channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Mod Log',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.modLog': args.channel.id } });

    return msg.createReply('You have successfully set the mod log channel to ' + args.channel + '.');
  }
}

module.exports = new SetModLog();
