-- Create classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR NOT NULL,
    inv_model VARCHAR NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR NOT NULL,
    inv_thumbnail VARCHAR NOT NULL,
    inv_price NUMERIC(10,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR NOT NULL,
    classification_id INTEGER REFERENCES classification(classification_id) ON DELETE CASCADE
);

-- Insert default classifications
INSERT INTO classification (classification_name) VALUES 
('Custom'),
('Sedan'),
('SUV'),
('Truck')
ON CONFLICT (classification_name) DO NOTHING;