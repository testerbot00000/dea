const patron = require('patron.js');

class MinimumSeconds extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'minimumseconds'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length >= options.length) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The amount of ' + argument.name + ' may not be lower than ' + options.length + ' seconds.');
  }
}

module.exports = new MinimumSeconds();
