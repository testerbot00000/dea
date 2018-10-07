const Logger = require('../utility/Logger.js');
const client = require('../structures/client.js');

client.on('reconnect', () => {
  Logger.log('Attempting to reconnect...', 'INFO');
});
