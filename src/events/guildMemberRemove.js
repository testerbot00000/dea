const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('guildMemberRemove', () => {
  (async (member) => {
  })()
    .catch((err) => Logger.handleError(err));
});
