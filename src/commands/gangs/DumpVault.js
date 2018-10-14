const patron = require('patron.js');
const { config: { gang: { maxUnique, maxAmount } } } = require('../../utility/Constants.js');
const ItemService = require('../../services/ItemService.js');

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
    const vault = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);

    if (vault.length >= maxUnique && vault.every(x => gang.vault[x] >= maxAmount)) {
      return msg.createErrorReply('your gang\'s vault cannot hold any more items.');
    }

    const inv = Object.keys(msg.dbUser.inventory).filter(x => msg.dbUser.inventory[x] > 0);
    const has = inv.filter(x => gang.vault[x] && gang.vault[x] < maxAmount);
    const passedFilter = inv.filter(x => !gang.vault[x] || gang.vault[x] < maxAmount).slice(0, maxUnique + has.length - vault.length);
    const needs = vault.filter(x => gang.vault[x] < maxAmount && !inv.includes(x));

    if (!passedFilter.length) {
      if (needs.length) {
        return msg.createErrorReply('you don\'t have any of the following item' + (needs.length > 1 ? 's' : '') + ' to dump: ' + needs.map(ItemService.capitializeWords).join(', ') + '.');
      }
      return msg.createErrorReply('you don\'t have any of your gang\'s current items to dump.');
    }

    const itemsToDump = passedFilter.map(x => ({
      item: x,
      amount: gang.vault[x] && gang.vault[x] + msg.dbUser.inventory[x] > maxAmount
        ? maxAmount - gang.vault[x]
        : msg.dbUser.inventory[x] > maxAmount
          ? maxAmount
          : msg.dbUser.inventory[x]
    }));

    let dumped = '';

    for (let i = 0; i < itemsToDump.length; i++) {
      const { item, amount } = itemsToDump[i];
      dumped += ItemService.capitializeWords(item) + (amount > 1 ? 's' : '') + ': ' + amount + (i !== itemsToDump.length - 1 ? '\n' : '');

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { ['inventory.' + item]: -amount } });
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { ['vault.' + item]: amount } });
    }

    const leader = msg.guild.members.get(gang.leaderId);

    await leader.tryDM(msg.author.tag + ' has just dumped the following into your gang\'s vault:\n' + dumped, { guild: msg.guild });

    return msg.createReply('you have successfully dumped the following into your gang\'s vault:\n' + dumped);
  }
}

module.exports = new DumpVault();
