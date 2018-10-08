const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const IncMoneyUpdate = require('../../database/updates/IncMoneyUpdate.js');

class Raid extends patron.Command {
  constructor() {
    super({
      names: ['raid'],
      groupName: 'gangs',
      description: 'Raid another gang\'s money.',
      cooldown: Constants.config.gang.cooldownRaid,
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'raid',
          type: 'quantity',
          example: '500',
          preconditionOptions: [{ minimum: Constants.config.gang.min }],
          preconditions: ['minimumcash', 'raidamount']
        }),
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          preconditions: ['argraidamount', 'notowngang', 'raidprec'],
          example: 'best gang ever',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    const gangLeader = await msg.client.users.get(gang.leaderId);
    const raidedGangLeader = await msg.client.users.get(args.gang.leaderId);
    const membersDeduction = args.gang.members.length * 5;
    const stolen = args.raid * 2;

    if (roll < Constants.config.gang.raidOdds - membersDeduction) {
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, new IncMoneyUpdate('wealth', stolen));
      await msg.client.db.gangRepo.updateGang(args.gang.leaderId, msg.guild.id, new IncMoneyUpdate('wealth', -stolen));
      await gangLeader.tryDM((msg.author.id === gang.leaderId ? 'You have' : msg.author.tag.boldify() + ' has') + ' raided ' + stolen.USD() + ' from ' + args.gang.name.boldify() + '.', { guild: msg.guild });
      await raidedGangLeader.tryDM(gang.name.boldify() + ' has raided ' + stolen.USD() + ' from your gang.', { guild: msg.guild });
      return msg.createReply('You\'ve successfully raided ' + stolen.USD() + ' from ' + args.gang.name.boldify() + '.');
    }

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, new IncMoneyUpdate('wealth', -args.raid));
    await gangLeader.tryDM((msg.author.id === gang.leaderId ? 'You have' : msg.author.tag.boldify() + ' has') + ' attempted to raid ' + stolen.USD() + ' from ' + args.gang.name.boldify() + ' but you failed horribly.', { guild: msg.guild });
    await raidedGangLeader.tryDM(gang.name.boldify() + ' has attempted to raid ' + stolen.USD() + ' from your gang but failed horrbily.', { guild: msg.guild });
    return msg.createErrorReply('Unfortunately your gang has failed to raid ' + stolen.USD() + ' from ' + args.gang.name.boldify() + '.');
  }
}

module.exports = new Raid();
