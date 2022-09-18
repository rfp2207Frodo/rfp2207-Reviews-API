const db = require('../db.js');

const get = async(product_id) => {
  let queryProduct = `SELECT "1", "2", "3", "4", "5", "false", "true" FROM product WHERE id = ${product_id}`;

  let queryCharacteristics = `SELECT id, name, "1", "2", "3", "4", "5" FROM product_characteristic WHERE product_id = ${product_id}`;

  const client = await db.connect();

  let productData;
  let characteristicData;


  //probably optimize the two awaits to run at the same time since they aren't reliant on each other
  await client
  .query(queryProduct)
  .then((res) => {
    productData = res.rows[0];
  })
  .catch((err) => console.log(err));

  await client
  .query(queryCharacteristics)
  .then((res) => {
    client.release();
    characteristicData = res.rows;
  })
  .catch((err) => {
    client.release();
    console.log(err);
  })

  let formatCharacteristicData = {};
  for (let characteristic of characteristicData) {
    formatCharacteristicData[characteristic.name] = {
      'id': characteristic.id,
      'value': averageRating(characteristic)
    };
  }

  return {
    'product_id': product_id.toString(),
    'ratings': {
      '1': productData['1'],
      '2': productData['2'],
      '3': productData['3'],
      '4': productData['4'],
      '5': productData['5']
    },
    'recommended': {
      'false': productData['false'],
      'true': productData['true']
    },
    'characteristics': formatCharacteristicData
  }
};

exports.get = get;

const averageRating = (characteristic) => {
  //optimize this later? maybe by changing schema column names so that this can be destructured
  let value1 = characteristic['1'];
  let value2 = characteristic['2'];
  let value3 = characteristic['3'];
  let value4 = characteristic['4'];
  let value5 = characteristic['5'];
  let totalValues = [value1, value2, value3, value4, value5].reduce((prevValue, currentValue) => prevValue + currentValue, 0);
  let weighedValues = [value1, value2*2, value3*3, value4*4, value5*5].reduce((prevValue, currentValue) => prevValue + currentValue, 0);
  return (weighedValues / totalValues).toString();
};