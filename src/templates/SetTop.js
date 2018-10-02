const patron = require('patron.js');
const db = require('../database');

class SetTop extends patron.Command {
  constructor(numb) {
    super({
      names: ['settop' + numb, 'top' + numb],
      groupName: 'administration',
      description: 'Sets the Top ' + numb + ' role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Top ' + numb,
          preconditions: ['hierarchy'],
          remainder: true
        })
      ]
    });

    this.numb = numb;
  }

  async run(msg, args) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { ['roles.top' + this.numb]: args.role.id } });
    return msg.createReply('You have successfully set the Top ' + this.numb + ' role to ' + args.role + '.');
  }
}

module.exports = SetTop;
