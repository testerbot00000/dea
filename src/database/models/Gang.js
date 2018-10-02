class Gang {
  constructor(leaderId, guildId, name) {
    this.leaderId = leaderId;
    this.guildId = guildId;
    this.name = name;
    this.wealth = 0;
    this.members = [];
  }
}

module.exports = Gang;
