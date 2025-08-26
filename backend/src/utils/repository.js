function addTotal(data, key = 'total') {
  if (!Array.isArray(data)) {
    return { data, total: NaN };
  }

  const total = data[0]?.[key];

  return { data, total };
}

module.exports = { addTotal }