const patron = require('patron.js');
const db = require('../../database');
const NumberUtil = require('../../utility/NumberUtil.js');
const Constants = require('../../utility/Constants.js');

class Bully extends patron.Command {
  constructor() {
    super({
      names: ['bully'],
      groupName: 'crime',
      description: 'Bully any user by changing their nickname.',
      coooldown: Constants.config.bully.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Johnny Boy#7052"',
          preconditions: ['noself', 'nomoderator']
        }),
        new patron.Argument({
          name: 'nickname',
          key: 'nickname',
          type: 'string',
          example: 'ass hat',
          preconditions: [{ name: 'maximumlength', options: { length: Constants.config.bully.maxLength } }],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await args.member.setNickname(args.nickname);
    return msg.createReply('You just __BULLIED__ ' + args.member.user.tag.boldify() + ' to ' + args.nickname.boldify() + '.');
  }
}

module.exports = new Bully();
