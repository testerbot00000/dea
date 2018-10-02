const patron = require('patron.js');

class Top extends patron.Precondition {
  constructor() {
    super({
      name: 'top'
    });
  }

  async run(command, msg, options) {
    if (msg.member.roles.has(msg.dbGuild.roles['top' + options.top]) === true) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must be one of the top ' + options.top + ' richest users in order to use this command.');
  }
}

module.exports = new Top();
