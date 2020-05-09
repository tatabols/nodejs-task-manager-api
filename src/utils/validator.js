const isValidKeys = (schemaKeys, bodyKeys) => {
  return bodyKeys.every((k) => schemaKeys.includes(k));
};

module.exports = isValidKeys;
