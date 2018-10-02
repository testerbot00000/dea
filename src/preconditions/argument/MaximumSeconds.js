const patron = require('patron.js');

class MaximumSeconds extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'maximumseconds'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length <= options.length) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The amount of ' + argument.name + ' may not be more than ' + options.length + ' seconds.');
  }
}

module.exports = new MaximumSeconds();
