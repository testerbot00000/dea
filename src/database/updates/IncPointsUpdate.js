class IncPointsUpdate {
  constructor(property, change) {
    this.$inc = {
      [property]: Math.round(change)
    };
  }
}

module.exports = IncPointsUpdate;

