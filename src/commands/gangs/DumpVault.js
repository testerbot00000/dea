const patron = require('patron.js');
const { config: { gang: { maxUnique, maxAmount } } } = require('../../utility/Constants.js');

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
    const vault = Object.keys(gang.vault).filter(x => gang[x] > 0);
    const inv = Object.keys(msg.dbUser.inventory).filter(x => msg.dbUser.inventory[x] > 0);
    const unique = inv.filter(x => vault[x] === undefined || vault[x] <= 0);

    if (vault.length + unique.length >= maxUnique) {
      return msg.createErrorReply('you may not have more than or equal to ' + maxUnique + ' items in your gang\'s vault.');
    } else if (inv.some(x => msg.dbUser.inventory[x] > maxAmount || vault[x] !== undefined && vault[x] + msg.dbUser.inventory[x] > maxAmount)) {
      return msg.createErrorReply('you may not have more than ' + maxAmount + ' of any item in your gang\'s vault');
    }

    for (const key in msg.dbUser.inventory) {
      const invGained = 'inventory.' + key;
      const vaultGained = 'vault.' + key;
      const amount = msg.dbUser.inventory[key];

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [invGained]: -amount } });
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { [vaultGained]: amount } });
    }

    const leader = msg.guild.members.get(gang.leaderId);

    await leader.tryDM(msg.author.tag + ' has just dumped all his items into your gangs vault', { guild: msg.guild });

    return msg.createReply('you have successfully dumped all of your items into your gangs vault.');
  }
}

module.exports = new DumpVault();
