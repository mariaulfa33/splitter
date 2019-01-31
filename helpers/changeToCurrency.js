function changeToCurrency(num) {
  return num.toLocaleString('en-ID', {
    style: 'currency',
    currency: 'IDR'
  });
  return changeToCurrency;
}

module.exports = changeToCurrency;