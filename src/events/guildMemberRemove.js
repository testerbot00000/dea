const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');
const db = require('../database');

client.on('guildMemberRemove', (member) => {
  (async () => {
    const gang = await db.gangRepo.findOne( { $or: [{ members: member.id }, { leaderId: member.id }, { elders: member.id }], $and: [{ guildId: member.guild.id }] } );
    
    if (gang !== null) {
      if (gang.leaderId !== member.id) {
        await db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $pull: { members: args.user.id } });
        await db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $pull: { elders: member.author.id } });
      } else {
        const newLeader = gang.members[0];
        await db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $pull: { members: newLeader } });
        await db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $pull: { elders: newLeader } });
        await db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $set: { leaderId: newLeader } });
      }
    }
  })()
    .catch((err) => Logger.handleError(err));
});
