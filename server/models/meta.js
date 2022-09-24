/* eslint-disable no-restricted-syntax */
const db = require('../db');

const averageRating = (characteristic) => {
  // Optimize this later? maybe by changing schema column names so that this can be destructured
  // Could also attempt to put the average as a column
  // so that there's no need to do this math during the GET request, only in the POST updates
  const value1 = characteristic['1'];
  const value2 = characteristic['2'];
  const value3 = characteristic['3'];
  const value4 = characteristic['4'];
  const value5 = characteristic['5'];
  const totalValues = [value1, value2, value3, value4, value5]
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);
  const weighedValues = [value1, value2 * 2, value3 * 3, value4 * 4, value5 * 5]
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);
  return (weighedValues / totalValues).toString();
};

const get = async (product_id) => {
  const queryProduct = `SELECT p."1", p."2", p."3", p."4", p."5", p."false", p."true",
  (SELECT json_agg(json_build_object('id', pc.id, 'name', pc.name, '1', pc."1", '2', pc."2", '3', pc."3", '4', pc."4", '5', pc."5"))
  FROM product_characteristic AS pc WHERE pc.product_id = ${product_id})
  FROM product AS p WHERE id = ${product_id}`;

  const client = await db.connect();

  const results = await client
    .query(queryProduct)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err));

  const formatCharacteristicData = {};
  for (const characteristic of results.json_agg) {
    formatCharacteristicData[characteristic.name] = {
      id: characteristic.id,
      value: averageRating(characteristic),
    };
  }

  await client.release();

  return {
    product_id: product_id.toString(),
    ratings: {
      1: results['1'],
      2: results['2'],
      3: results['3'],
      4: results['4'],
      5: results['5'],
    },
    recommended: {
      false: results.false,
      true: results.true,
    },
    characteristics: formatCharacteristicData,
  };
};

exports.get = get;
