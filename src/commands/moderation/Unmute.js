const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Unmute extends patron.Command {
  constructor() {
    super({
      names: ['unmute'],
      groupName: 'moderation',
      description: 'Unmute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Jimmy Johnson#3636"'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'bribed me 50k',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const welcomerole = msg.guild.roles.get(msg.dbGuild.roles.welcome);
    const role = msg.guild.roles.get(msg.dbGuild.roles.muted);

    if (msg.dbGuild.roles.muted === null) {
      return msg.createErrorReply('You must set a muted role with the `' + Constants.data.misc.prefix + 'setmute @Role` command before you can unmute users.');
    } else if (args.member.roles.has(msg.dbGuild.roles.muted) === false) {
      return msg.createErrorReply('This user is not muted.');
    } else if (welcomerole !== null) {
      await args.member.addRole(welcomerole);
      await args.member.removeRole(role);
      await msg.createReply('You have successfully unmuted ' + args.member.user.tag + '.');
      await ModerationService.tryInformUser(msg.guild, msg.author, 'unmuted', args.member.user, args.reason);
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unmute', Constants.data.colors.unmute, args.reason, msg.author, args.member.user);
    }

    if (role === undefined) {
      return msg.createErrorReply('The set muted role has been deleted. Please set a new one with the `' + Constants.data.misc.prefix + 'setmute Role` command.');
    }

    await args.member.removeRole(role);
    await msg.createReply('You have successfully unmuted ' + args.member.user.tag + '.');
    await ModerationService.tryInformUser(msg.guild, msg.author, 'unmuted', args.member.user, args.reason);
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unmute', Constants.data.colors.unmute, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Unmute();
