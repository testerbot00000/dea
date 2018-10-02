const db = require('../database');
const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('guildMemberUpdate', () => {
  (async (oldMember, newMember) => {
  })()
    .catch((err) => Logger.handleError(err));
});
