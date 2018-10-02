const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');

class FindUserGang extends patron.Command {
  constructor() {
    super({
      names: ['findusergang'],
      groupName: 'gangs',
      description: 'Finds a user\'s gang.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'nigger#9384',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let leader = '';
    let members = '';
    const gang = await db.gangRepo.findOne( { $or: [{ members: args.member.id }, { leaderId: args.member.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('This user is not in a gang.');
    }

    if (gang.leaderId !== null && gang.leaderId !== undefined) {
      const getLeader = await msg.guild.members.get(gang.leaderId);
      leader = getLeader.user.tag;
    } else {
      leader = 'Nobody';
    }

    if (gang.members.length > 0) {
      for (let i = 0; i < gang.members.length; i++) {
        const member = gang.members[i];
        const grabMembers = await msg.guild.members.get(member);
        members += grabMembers.user.tag + ', ';
      }
    }
    return msg.channel.createMessage('**Gang:** ' + gang.name + '\n**Leader:** ' + leader + (gang.members !== undefined && gang.members !== null && gang.members.length > 0 ? '\n**Members:** ' + members.substring(0, members.length - 2) : '') + '\n**Wealth:** ' + NumberUtil.format(gang.wealth));
  }
}

module.exports = new FindUserGang();
