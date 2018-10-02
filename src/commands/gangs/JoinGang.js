const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');

class JoinGang extends patron.Command {
  constructor() {
    super({
      names: ['joingang'],
      groupName: 'gangs',
      description: 'Asks leader to join his gang.',
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
    if (gang !== null) {
      return msg.createErrorReply('You\'re already in a gang.');
    } else if (args.gang.members.length >= 4) {
      return msg.createErrorReply('Sorry, this gang is too full.');
    }

    const leader = await msg.client.users.get(args.gang.leaderId);
  
    if (leader !== null) {
      const key = Random.nextInt(0, 2147000000).toString();
      
      await leader.tryDM(msg.author.tag.boldify() + ' is trying to join your gang, reply with "' + key + '" within the next 5 minutes to accept this.', { guild: msg.guild });
      await msg.createReply('The leader of this gang has successfully been informed of your join request.');

      const result = await leader.dmChannel.awaitMessages(m => m.author.id === leader.id && m.content.includes(key), { time: 300000, maxMatches: 1 });

      if (result.size >= 1) {
        await db.gangRepo.updateGang(args.gang.leaderId, msg.guild.id, { $push: { members: msg.author.id } });
        await leader.tryDM('You\'ve successfully let ' + msg.author.tag + ' join your gang.', { guild: msg.guild });
        return msg.author.tryDM('You\'ve successfully joined gang ' + args.gang.name.boldify() + '.', { guild: msg.guild });
      }

      return msg.author.tryDM(leader.tag.boldify() + ' didn\'t respond to your join request.', { guild: msg.guild });
    }

    return msg.createReply('The leader of that gang is no longer in this server. ***RIP GANG ROFL***');
  }
}

module.exports = new JoinGang();
