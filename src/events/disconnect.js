const Logger = require('../utility/Logger.js');
const client = require('../structures/client.js');

client.on('disconnect', () => {
  Logger.log(client.user.username + ' has disconnected.');
});
