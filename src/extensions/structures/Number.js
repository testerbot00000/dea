const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

Number.prototype.USD = function () {
  return formatter.format(this);
};

Number.prototype.isEven = function () {
  return this % 2 === 0;
};
