const NumberUtil = require('../utility/NumberUtil.js');
const db = require('../database');

class RankService {
  async handle(dbUser, dbGuild, member, users) {
    await member.guild.fetchMember(member.client.user);

    if (member.guild.me.hasPermission('MANAGE_ROLES') === false) {
      return;
    }

    const sortedUsers = users.sort((a, b) => b.cash - a.cash);
    const position = sortedUsers.findIndex((v) => v.userId === dbUser.userId) + 1;
    const highsetRolePosition = member.guild.me.highestRole.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const cash = NumberUtil.realValue(dbUser.cash);

    for (const rank of dbGuild.roles.rank) {
      const role = member.guild.roles.get(rank.id);

      if (role !== undefined && role.position < highsetRolePosition) {
        if (member.roles.has(role.id) === false) {
          if (cash >= rank.cashRequired) {
            rolesToAdd.push(role);
          }
        } else if (cash < rank.cashRequired) {
          rolesToRemove.push(role);
        }
      }
    }

    this.topHandle(position, 10, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);
    this.topHandle(position, 25, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);
    this.topHandle(position, 50, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);

    if (rolesToAdd.length > 0) {
      return member.addRoles(rolesToAdd);
    } else if (rolesToRemove.length > 0) {
      return member.removeRoles(rolesToRemove);
    }
  }

  getRank(dbUser, dbGuild, guild) {
    let role;
    const cash = NumberUtil.realValue(dbUser.cash);

    for (const rank of dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired)) {
      if (cash >= rank.cashRequired) {
        role = guild.roles.get(rank.id);
      }
    }

    return role;
  }

  topHandle(position, numb, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove) {
    const role = member.guild.roles.get(dbGuild.roles['top' + numb]);

    if (role !== undefined && role.position < highsetRolePosition) {
      if (member.roles.has(role.id) === false) {
        if (position <= numb) {
          rolesToAdd.push(role);
        }
      } else if (position > numb) {
        rolesToRemove.push(role);
      }
    }
  }
}

module.exports = new RankService();
