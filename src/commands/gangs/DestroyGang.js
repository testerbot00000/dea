const db = require('../../database');
const patron = require('patron.js');

class DestroyGang extends patron.Command {
  constructor() {
    super({
      names: ['destroygang', 'desgang'],
      groupName: 'gangs',
      description: 'Destroy your gang.'
    });
  }

  async run(msg, args) {
    const gang = await db.gangRepo.findOne( { $or: [{ members: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] } );

    if (gang === null) {
      return msg.createErrorReply('You\'re not in a gang.');
    } else if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('You\'re not the leader of your gang.');
    }

    await db.gangRepo.deleteGang(gang.leaderId, msg.guild.id);
    return msg.createReply('Successfully destroyed your gang.');
  }
}

module.exports = new DestroyGang();
