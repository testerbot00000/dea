const patron = require('patron.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const ModerationService = require('../../services/ModerationService.js');

class Vote extends patron.Command {
  constructor() {
    super({
      names: ['vote'],
      groupName: 'polls',
      description: 'Vote on a poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: 'is john gay'
        }),
        new patron.Argument({
          name: 'choice',
          key: 'choice',
          type: 'choice',
          example: 'yes',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const elderDays = NumberUtil.msToTime(Constants.config.polls.elderTimeRequired).days;
    if (args.poll.elderOnly === true && msg.member.joinedAt - Date.now() > Constants.config.polls.elderTimeRequired) {
      return msg.createErrorReply('You may not vote on this poll until you\'ve been in this server for ' + elderDays + ' days.');
    } else if (args.poll.modOnly === true && ModerationService.getPermLevel(msg.dbGuild, msg.member) < 1) {
      return msg.createErrorReply('You may only vote on this poll if you\'re a moderator.');
    } else if (args.poll.voters.includes(msg.author.id)) {
      return msg.createErrorReply('You\'ve already voted on this poll.');
    }

    const votedChoice = 'choices.' + key;
    await db.pollRepo.updatePoll(args.poll.name, args.poll.creatorId, msg.guild.id, { $inc: { [votedChoice]: 1 } });
    await db.pollRepo.updatePoll(args.poll.name, args.poll.creatorId, msg.guild.id, { $push: { voters: msg.author.id } });
    return msg.createReply('You\'ve successfully voted `' + args.choice + '` on poll: ' + args.poll.name.boldify() + '.');
  }
}

module.exports = new Vote();
