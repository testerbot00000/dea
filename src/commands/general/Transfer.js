const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');
const Constants = require('../../utility/Constants.js');

class Transfer extends patron.Command {
  constructor() {
    super({
      names: ['transfer', 'sauce', 'donate'],
      groupName: 'general',
      description: 'Transfer money to any member.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Supa Hot Fire#1337"',
          preconditions: ['noself']
        }),
        new patron.Argument({
          name: 'transfer',
          key: 'transfer',
          type: 'quantity',
          example: '500',
          preconditions: ['cash', { name:'minimumcash', options: { minimum: Constants.config.transfer.min } }]
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * Constants.config.transfer.cut;
    const received = args.transfer - transactionFee;
    const newDbUser = await db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await db.userRepo.modifyCash(msg.dbGuild, args.member, received);

    return msg.createReply('You have successfully transfered ' + received.USD() + ' to '+ args.member.user.tag.boldify() + '. Transaction fee: ' + transactionFee.USD() + '. Balance: ' + NumberUtil.format(newDbUser.cash) + '.');
  }
}

module.exports = new Transfer();
