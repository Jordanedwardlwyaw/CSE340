INSERT INTO account (account_firstname, account_lastname, account_email, account_password) Values ('Tony', 'Stark', 'tony@starkent.com', ' Iam1ronM@n');

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

UPDATE inventory SET inv_description = replace(inv_description, 'small interiors', 'a huge interior') WHERE inv_id = 10;

SELECT inv_make, inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE i.classification_id = 2;

UPDATE inventory SET inv_image=replace(inv_image,'/images','/images/vehicles'), inv_thumbnail=replace(inv_thumbnail, '/images', '/images/vehicles');