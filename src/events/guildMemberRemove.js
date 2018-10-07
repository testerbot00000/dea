const client = require('../structures/Client.js');

client.on('guildMemberRemove', async member => {
  const gang = await client.db.gangRepo.findOne({ $or: [{ members: member.id }, { leaderId: member.id }, { elders: member.id }], $and: [{ guildId: member.guild.id }] });

  if (gang) {
    const update = (y, z) => new member.client.db.updates.Pull(y, z);

    if (gang.leaderId !== member.id) {
      await client.db.gangRepo.updateGang(gang.leaderId, member.guild.id, update('members', member.id));
      await client.db.gangRepo.updateGang(gang.leaderId, member.guild.id, update('elders', member.id));
    } else {
      const newLeader = gang.members[0] || gang.elders[0];

      await client.db.gangRepo.updateGang(gang.leaderId, member.guild.id, update('members', newLeader));
      await client.db.gangRepo.updateGang(gang.leaderId, member.guild.id, update('elders', newLeader));
      await client.db.gangRepo.updateGang(gang.leaderId, member.guild.id, { $set: { leaderId: newLeader } });
    }
  }
});
