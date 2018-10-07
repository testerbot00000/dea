const MemberService = require('../services/MemberService.js');
const client = require('../structures/client.js');

client.on('guildMemberAdd', member => MemberService.join(member));
