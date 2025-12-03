-- database/database.sql - PostgreSQL syntax for Render.com

-- Drop tables if they exist (optional - be careful!)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;

-- Create classification table
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_year INTEGER NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  inv_price NUMERIC(10,2) NOT NULL,
  inv_miles INTEGER NOT NULL,
  inv_color VARCHAR(50) NOT NULL,
  classification_id INTEGER REFERENCES classification(classification_id)
);

-- Insert classifications
INSERT INTO classification (classification_name) VALUES 
  ('Classic Cars'),
  ('SUVs'),
  ('Trucks'),
  ('Sedans');

-- Insert Classic Cars
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
  inv_price, inv_miles, inv_color, classification_id
) VALUES 
  ('DMC', 'Delorean', 1982, 'The iconic time-traveling sports car with gull-wing doors. Made famous by Back to the Future movies.', 'https://images.unsplash.com/photo-1519241047957-be3d40d3c197?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1519241047957-be3d40d3c197?w=400&auto=format&fit=crop&q=80', 85000, 12500, 'Stainless Steel', 1),
  ('Chevrolet', 'Bel Air', 1957, 'Iconic American classic with chrome details and vintage styling.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80', 95000, 45000, 'Turquoise & White', 1);

-- Insert SUVs
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
  inv_price, inv_miles, inv_color, classification_id
) VALUES 
  ('Jeep', 'Wrangler Rubicon', 2023, 'Off-road capable SUV with 4x4 system, rock-trac transfer case, and fox performance shocks.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80', 52800, 12500, 'Sting Gray', 2),
  ('Cadillac', 'Escalade', 2023, 'Full-size luxury SUV with premium leather interior and advanced safety features.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80', 96800, 8000, 'Crystal White', 2);

-- Insert Trucks
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
  inv_price, inv_miles, inv_color, classification_id
) VALUES 
  ('Ford', 'F-150', 2023, 'America''s best-selling truck with 3.5L EcoBoost V6 engine.', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&auto=format&fit=crop&q=80', 55800, 18500, 'Oxford White', 3),
  ('Chevrolet', 'Silverado', 2023, 'Powerful pickup with trailering package and advanced technology.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80', 49800, 16500, 'Northsky Blue', 3);

-- Insert Sedans
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
  inv_price, inv_miles, inv_color, classification_id
) VALUES 
  ('Toyota', 'Camry XSE', 2023, 'Midsize sedan with 3.5L V6 engine and sport-tuned suspension.', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80', 32800, 5500, 'Midnight Black', 4),
  ('Honda', 'Accord Touring', 2023, 'Comfortable sedan with hybrid powertrain and Honda Sensing safety suite.', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&auto=format&fit=crop&q=80', 36500, 7800, 'Platinum White', 4);

-- Verify data
SELECT 'Classifications' as table_name, COUNT(*) as count FROM classification
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory;