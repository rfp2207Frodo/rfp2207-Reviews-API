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
  product_id INTEGER,
  rating INTEGER NOT NULL,
  date VARCHAR NOT NULL,
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

--Copy products.csv into product table (for product_id)
-- \copy product FROM './data/product.csv' CSV HEADER;