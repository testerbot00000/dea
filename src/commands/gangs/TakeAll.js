const patron = require('patron.js');

class TakeAll extends patron.Command {
  constructor() {
    super({
      names: ['takeall', 'takeallvault'],
      groupName: 'gangs',
      description: 'Take all your gang\'s item vault.',
      preconditions: ['ingang']
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (gang.leaderId !== msg.author.id) {
      return msg.createErrorReply('you\'re not the owner of your gang.');
    }

    for (const key in gang.vault) {
      const invGained = 'inventory.' + key;
      const vaultGained = 'vault.' + key;
      const amount = gang.vault[key];

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [invGained]: amount } });
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { [vaultGained]: -amount } });
    }

    return msg.createReply('you have successfully taken all of your gangs items from the vault.');
  }
}

module.exports = new TakeAll();
