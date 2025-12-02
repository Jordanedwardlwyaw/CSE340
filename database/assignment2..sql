-- Task 1: Write SQL Statements

-- 1. Insert new record for Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony Stark's account_type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark's record from the account table
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Update the GM Hummer description from 'the small interiors' to 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Select make and model from inventory and classification name from classification table for "Sport" category
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM 
    inventory
INNER JOIN 
    classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

-- 6. Update image paths to include /vehicles
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');