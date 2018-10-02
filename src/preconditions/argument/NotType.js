const patron = require('patron.js');

class NotType extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'nottype'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (options.types.includes(value.type)) {
      if (value.type === 'gun') {
        if (value.damage !== undefined && Number.isInteger(value.damage) === false) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid damage.');
        } else if (value.damage === undefined) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid damage.');
        }

        if (value.accuracy !== undefined && Number.isInteger(value.accuracy) === false) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid accuracy.');
        } else if (value.accuracy === undefined) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid accuracy.');
        }

        if (value.bullet === undefined) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has no set bullets');
        }

        if (msg.dbUser.inventory[value.bullet] === undefined || msg.dbUser.inventory[value.bullet] <= 0) {
          return patron.PreconditionResult.fromError(command, 'You have no ' + value.bullet + '(s) to shoot with.');
        }

        msg.bullet = 'inventory.' + value.bullet;
      }
      if (value.type === 'knife') {
        if (value.damage !== undefined && Number.isInteger(value.damage) === false) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid damage.');
        } else if (value.damage === undefined) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid damage.');
        }

        if (value.accuracy !== undefined && Number.isInteger(value.accuracy) === false) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid accuracy.');
        } else if (value.accuracy === undefined) {
          return patron.TypeReaderResult.fromError(command, 'This weapon has an invalid accuracy.');
        }
      }
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'This is not a correct item.');
  }
}

module.exports = new NotType();
