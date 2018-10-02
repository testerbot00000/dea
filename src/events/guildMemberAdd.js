const MemberService = require('../services/MemberService.js');
const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('guildMemberAdd', (member) => {
  (async () => {
    return MemberService.join(member);
  })()
    .catch((err) => Logger.handleError(err));
});
