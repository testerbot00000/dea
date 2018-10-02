const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');

class Gang extends patron.Command {
  constructor() {
    super({
      names: ['gang', 'findgang'],
      groupName: 'gangs',
      description: 'Finds a gang.',
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let leader = '';
    let members = '';
    let gang = args.gang;
    if (String.isNullOrWhiteSpace(args.gang.name)) {
      gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
      if (gang === null) {
        return msg.createErrorReply('You\'re not in a gang, therefore you must specify one.');
      }
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

module.exports = new Gang();
