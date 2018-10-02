const Logger = require('../utility/Logger.js');
const client = require('../singletons/client.js');

client.on('reconnect', () => {
  (async () => {
    Logger.log('Attempting to reconnect...');
  })()
    .catch((err) => Logger.handleError(err));
});