const Logger = require('../utility/Logger.js');
const client = require('../singletons/client.js');

client.on('disconnect', () => {
  (async () => {
    Logger.log(client.user.username + ' has disconnected.');
  })()
    .catch((err) => Logger.handleError(err));
});
