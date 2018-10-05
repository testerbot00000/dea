const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random');

class InviteToGang extends patron.Command {
  constructor() {
    super({
      names: ['invitetogang', 'invitegang'],
      groupName: 'gangs',
      description: 'Invites member to join your gang.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'ash#4930',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
    const userGang = await db.gangRepo.findOne( { $or: [{ members: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }]});

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (userGang !== null) {
      return msg.createErrorReply('This user is already in a gang.');
    } else if (gang.members.length + gang.elders.length >= 10) {
      return msg.createErrorReply('Sorry, your gang is too full.');
    } else if (msg.author.id !== gang.leaderId && gang.elders.some((v) => v === msg.author.id) === false) {
      return msg.createErrorReply('You cannot invite anyone top your gang, since you\'re not a leader, or elder of it.');
    }

    const key = Random.nextInt(0, 2147000000).toString();

    if (args.user.dmChannel === null) {
      await args.user.createDM();
    }
      
    await args.user.tryDM(msg.author.tag.boldify() + ' is trying to invite you to his gang ' + gang.name.boldify() + ', reply with "' + key + '" within the next 5 minutes to accept this.', { guild: msg.guild });
    await msg.createReply('The user has successfully been informed of your join request.');

    const result = await args.user.dmChannel.awaitMessages(m => m.author.id === args.user.id && m.content.includes(key), { time: 300000, maxMatches: 1 });

    if (result.size >= 1) {
      await db.gangRepo.updateGang(msg.author.id, msg.guild.id, { $push: { members: args.user.id } });
      await msg.author.tryDM('You\'ve successfully let ' + args.user.tag + ' join your gang.', { guild: msg.guild });
      return args.user.tryDM('You\'ve successfully joined gang ' + gang.name.boldify() + '.', { guild: msg.guild });
    }

    return msg.author.tryDM(args.user.tag.boldify() + ' didn\'t respond to your join request.', { guild: msg.guild });
  }
}

module.exports = new InviteToGang();
