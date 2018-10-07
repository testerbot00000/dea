const client = require('../structures/client.js');
const Logger = require('../utility/Logger.js');

client.on('error', err => Logger.handleError(err));
