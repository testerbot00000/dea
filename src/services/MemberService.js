const db = require('../database');
const Random = require('../utility/Random.js');

class MemberService {
  async join(member) {
    const dbGuild = await db.guildRepo.getGuild(member.guild.id);

    if (dbGuild.roles.muted !== null && await db.muteRepo.anyMute(member.id, member.guild.id) === true) {
      const role = member.guild.roles.get(dbGuild.roles.muted);

      if (role === undefined || member.guild.me.hasPermission('MANAGE_ROLES') === false || role.position >= member.guild.me.highestRole.position) {
        return;
      }

      return member.addRole(role);
    }
  }
}

module.exports = new MemberService();
