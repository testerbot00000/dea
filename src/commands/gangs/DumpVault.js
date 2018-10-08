const patron = require('patron.js');

class DumpVault extends patron.Command {
  constructor() {
    super({
      names: ['dumpvault', 'dump', 'dumpitems'],
      groupName: 'gangs',
      description: 'Dump your inventory into a gangs vault.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    for (const key in msg.dbUser.inventory) {
      const invGained = 'inventory.' + key;
      const vaultGained = 'vault.' + key;
      const amount = msg.dbUser.inventory[key];

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [invGained]: -amount } });
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { [vaultGained]: amount } });
    }

    return msg.createReply('you have successfully dumped all of your items to your gangs vault.');
  }
}

module.exports = new DumpVault();
