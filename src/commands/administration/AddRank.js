const db = require('../../database');
const patron = require('patron.js');

class AddRank extends patron.Command {
  constructor() {
    super({
      names: ['addrank', 'setrank', 'enablerank'],
      groupName: 'administration',
      description: 'Add a rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          preconditions: ['hierarchy']
        }),
        new patron.Argument({
          name: 'cashRequired',
          key: 'cashRequired',
          type: 'quantity',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.roles.rank.some((role) => role.id === args.role.id) === true) {
      return msg.createErrorReply('This rank role has already been set.');
    }

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Push('roles.rank', { id: args.role.id, cashRequired: Math.round(args.cashRequired) }));

    return msg.createReply('You have successfully added the rank role ' + args.role + ' with a cash required amount of ' + args.cashRequired.USD() + '.');
  }
}

module.exports = new AddRank();
