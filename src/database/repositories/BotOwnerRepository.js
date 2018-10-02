const BaseRepository = require('./BaseRepository.js');
const BotOwnersQuery = require('../queries/BotOwnersQuery.js');
const BotOwners = require('../models/BotOwners.js');

class BotOwnersRepository extends BaseRepository {
  anyBotOwners(userId) {
    return this.any(new BotOwnersQuery(userId));
  }

  findBotOwner(userId) {
    return this.findOne(new BotOwnersQuery(userId));
  }

  insertBotOwner(userId) {
    return this.insertOne(new BotOwners(userId));
  }

  deleteBotOwner(userId) {
    return this.deleteOne(new BotOwnersQuery(userId));
  }
}

module.exports = BotOwnersRepository;
