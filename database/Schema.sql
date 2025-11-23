 -- Create classification table
 DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  mileage INT NOT NULL,
  description TEXT,
  img_full VARCHAR(255), -- Added image path column
  classification_id INT REFERENCES classification(classification_id)
);