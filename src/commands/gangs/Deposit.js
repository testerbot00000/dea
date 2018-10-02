const patron = require('patron.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const IncMoneyUpdate = require('../../database/updates/IncMoneyUpdate.js');

class Deposit extends patron.Command {
  constructor() {
    super({
      names: ['deposit'],
      groupName: 'gangs',
      description: 'Deposit into a gangs wealth.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'transfer',
          type: 'quantity',
          example: '500',
          preconditions: ['cash', { name: 'minimumcash', options: { minimum: Constants.config.transfer.min } }]
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * Constants.config.transfer.cut;
    const received = args.transfer - transactionFee;
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    }

    const leader = msg.client.users.get(gang.leaderId);
    await db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await db.gangRepo.updateGang(gang.leaderId, gang.guildId, new IncMoneyUpdate('wealth', received));
    const newGang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );
    await leader.tryDM(msg.author.tag.boldify() + ' has deposited ' + received.USD() + ' to your gang.', { guild: msg.guild });
    return msg.createReply('You have successfully deposited ' + received.USD() + ' to your gang. Transaction fee: ' + transactionFee.USD() + '. Wealth: ' + NumberUtil.format(newGang.wealth) + '.');
  }
}

module.exports = new Deposit();
