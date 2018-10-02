const DateUtil = require('./DateUtil.js');
const fs = require('fs');
const util = require('util');
const path = require('path');
const logsPath = path.join(__dirname, '../../logs');
const appendFile = util.promisify(fs.appendFile);

class Logger {
  constructor() {
    if (fs.existsSync(logsPath) === false) {
      fs.mkdirSync(logsPath);
    }

    this.date = new Date();
    this.UTCDate = DateUtil.UTCDate(this.date);
    this.stream = fs.createWriteStream(logsPath + '/' + this.UTCDate + '.txt', { flags: 'a' });
  }

  async log(message, level) {
    const newDate = new Date();

    if (newDate.getUTCDate() !== this.date.getUTCDate()) {
      this.date = newDate;
      this.UTCDate = DateUtil.UTCDate(this.date);
      this.stream = fs.createWriteStream(logsPath + '/' + this.UTCDate + '.txt', { flags: 'a' });
    }

    if (this.stream.writable === false) {
      await this.waitTillWritable();
    }

    const formattedMessage = DateUtil.UTCTime(newDate) + ' [' + level + '] ' + message;

    console.log(formattedMessage);

    if (level === 'ERROR') {
      await appendFile(logsPath + '/' + this.UTCDate + ' Errors.txt', formattedMessage + '\n');
    }

    return new Promise((resolve) => {
      this.stream.write(formattedMessage + '\n', () => {
        resolve();
      });
    });
  }

  handleError(err) {
    return this.log(util.inspect(err, { depth: null }), 'ERROR');
  }

  waitTillWritable() {
    return new Promise((resolve) => {
      this.stream.on('open', () => {
        resolve();
      });
    });
  }
}

module.exports = new Logger();
