const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class SetGuildPrefix extends patron.Command {
  constructor() {
    super({
      names: ['setprefix', 'setguildpefix', 'setguildsprefix'],
      groupName: 'administration',
      description: 'Sets the guild\'s prefix.',
      args: [
        new patron.Argument({
          name: 'prefix',
          key: 'prefix',
          type: 'string',
          example: '$',
          preconditionOptions: [{ length: Constants.guildSettings.maxPrefix }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'settings.prefix': args.prefix } });

    return msg.createReply('you\'ve successfully set the guild\'s prefix to `' + args.prefix + '`.');
  }
}

module.exports = new SetGuildPrefix();
