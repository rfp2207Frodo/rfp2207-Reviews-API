--Wipe database to create fresh
\c postgres;

DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

--Store counters for ratings/recommended
CREATE TABLE product (
  id SERIAL PRIMARY KEY UNIQUE,
  "1" INTEGER DEFAULT(0),
  "2" INTEGER DEFAULT(0),
  "3" INTEGER DEFAULT(0),
  "4" INTEGER DEFAULT(0),
  "5" INTEGER DEFAULT(0),
  "false" INTEGER DEFAULT(0),
  "true" INTEGER DEFAULT(0)
);

--Store average score for characteristic per product
CREATE TABLE product_characteristic (
  id SERIAL PRIMARY KEY UNIQUE,
  product_id INTEGER,
  name VARCHAR(10),
  "1" INTEGER DEFAULT(0),
  "2" INTEGER DEFAULT(0),
  "3" INTEGER DEFAULT(0),
  "4" INTEGER DEFAULT(0),
  "5" INTEGER DEFAULT(0),
  value DOUBLE PRECISION DEFAULT(0)
);

--Store review data per product
CREATE TABLE review (
  id SERIAL PRIMARY KEY UNIQUE,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date NUMERIC NOT NULL,
  summary VARCHAR(250) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT(false),
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response VARCHAR,
  helpfulness INTEGER DEFAULT(0)
);

--Store individual photos per review
CREATE TABLE review_photo (
  id SERIAL PRIMARY KEY UNIQUE,
  review_id INTEGER,
  url VARCHAR
);

--Store individual characteristic value per review
CREATE TABLE review_characteristic (
  id SERIAL PRIMARY KEY UNIQUE,
  characteristic_id INTEGER,
  review_id INTEGER,
  value SMALLINT NOT NULL
);

--Copy reviews.csv into review table
\copy review FROM './data/reviews.csv' CSV HEADER;

--Copy reviews_photos.csv into review_photo table
\copy review_photo FROM './data/reviews_photos.csv' CSV HEADER;

--Copy characteristics_reviews.csv into review_characteristic table
\copy review_characteristic FROM './data/characteristic_reviews.csv' CSV HEADER;

--Copy characteristics.csv into product_characteristic table (ignore total values for now)
\copy product_characteristic (id, product_id, name) FROM './data/characteristics.csv' CSV HEADER;

--Copy products.csv into temporary table to copy into products table
CREATE TABLE temporary_product (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR,
  slogan VARCHAR,
  description TEXT,
  category VARCHAR,
  default_price INTEGER
);
\copy temporary_product FROM './data/product.csv' CSV HEADER;

INSERT INTO product (id)
SELECT id FROM temporary_product;

DROP TABLE temporary_product;

--Update total rating values for every product
--Using temporary table, maybe will attempt refactoring into not using it later

CREATE TABLE temporary_1star (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_1star (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE rating = 1 GROUP BY product_id;

UPDATE product AS p SET "1" =
COALESCE((SELECT count FROM temporary_1star AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_1star;

--------

CREATE TABLE temporary_2star (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_2star (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE rating = 2 GROUP BY product_id;

UPDATE product AS p SET "2" =
COALESCE((SELECT count FROM temporary_2star AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_2star;


--------

CREATE TABLE temporary_3star (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_3star (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE rating = 3 GROUP BY product_id;

UPDATE product AS p SET "3" =
COALESCE((SELECT count FROM temporary_3star AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_3star;


-------

CREATE TABLE temporary_4star (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_4star (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE rating = 4 GROUP BY product_id;

UPDATE product AS p SET "4" =
COALESCE((SELECT count FROM temporary_4star AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_4star;


------

CREATE TABLE temporary_5star (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_5star (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE rating = 5 GROUP BY product_id;

UPDATE product AS p SET "5" =
COALESCE((SELECT count FROM temporary_5star AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_5star;


------- Recommended

CREATE TABLE temporary_true (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_true (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE recommend = true GROUP BY product_id;

UPDATE product AS p SET "true" =
COALESCE((SELECT count FROM temporary_true AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_true;



--------

CREATE TABLE temporary_false (
  product_id INTEGER PRIMARY KEY UNIQUE,
  count INTEGER
);

INSERT INTO temporary_false (product_id, count)
SELECT product_id, COUNT(*) FROM review WHERE recommend = false GROUP BY product_id;

UPDATE product AS p SET "false" =
COALESCE((SELECT count FROM temporary_false AS t WHERE p.id = t.product_id), 0);

DROP TABLE temporary_false;



--Update total characteristic ratings for each product

-- CREATE TABLE temporary_count (
--   review_id INTEGER PRIMARY KEY,
--   count INTEGER
-- );

-- CREATE TABLE temporary_count (
--   product_id INTEGER PRIMARY KEY,
--   count INTEGER
-- );

-- INSERT INTO temporary_count (review_id, count)
-- SELECT review_id, COUNT(*) FROM review_characteristic
-- WHERE value = 1
-- GROUP BY review_id;

-- INSERT INTO temporary_count (product_id, count)
-- SELECT product_id, COUNT(*) FROM
-- (SELECT r.product_id, joiner.count FROM review AS r
-- INNER JOIN (SELECT review_id, ))




-- UPDATE product_characteristic AS pc
-- SET "1" =
-- (SELECT id FROM product AS p WHERE pc.product_id = p.id AND p.id =
-- (SELECT id FROM review AS r WHERE p.id = r.product_id));




-- SELECT r.id, r.product_id, rc.value FROM review AS r
-- INNER JOIN review_characteristic AS rc
-- ON r.id = rc.review_id
-- WHERE rc.rating = 1;



--UPDATE product_characteristic SET "1" = (SELECT COUNT(*) FROM review_photo);

--SELECT product_id, COUNT(*) FROM review WHERE rating = 1 GROUP BY product_id;

-- SELECT review_id, COUNT (*) FROM review_characteristic
-- WHERE value = 1
-- GROUP BY review_id;