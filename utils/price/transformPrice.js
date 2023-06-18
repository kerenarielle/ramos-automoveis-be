const transformPrice = (value) => {
  const newValue = value.split('R$')[1];

  let result = newValue;
  if (result.includes('.')) {
    result = result.replace('.', '');

    if (result.includes(',')) {
      result = result.replace(',', '.')
    }
  }

  if (result.includes(',')) result = result.replace(',', '.')

  return result;
}

module.exports = transformPrice;
