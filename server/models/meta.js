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
  const queryProduct = `SELECT "1", "2", "3", "4", "5", "false", "true" FROM product WHERE id = ${product_id}`;

  const queryCharacteristics = `SELECT id, name, "1", "2", "3", "4", "5" FROM product_characteristic WHERE product_id = ${product_id}`;

  const client = await db.connect();

  let productData;
  let characteristicData;

  // probably optimize the two awaits to run at the same time
  // since they aren't reliant on each other
  await client
    .query(queryProduct)
    .then((res) => {
      const data = res.rows[0];
      productData = data;
    })
    .catch((err) => console.log(err));

  await client
    .query(queryCharacteristics)
    .then(async (res) => {
      await client.release();
      characteristicData = res.rows;
    })
    .catch(async (err) => {
      await client.release();
      console.log(err);
    });

  const formatCharacteristicData = {};
  for (const characteristic of characteristicData) {
    formatCharacteristicData[characteristic.name] = {
      id: characteristic.id,
      value: averageRating(characteristic),
    };
  }

  return {
    product_id: product_id.toString(),
    ratings: {
      1: productData['1'],
      2: productData['2'],
      3: productData['3'],
      4: productData['4'],
      5: productData['5'],
    },
    recommended: {
      false: productData.false,
      true: productData.true,
    },
    characteristics: formatCharacteristicData,
  };
};

exports.get = get;
