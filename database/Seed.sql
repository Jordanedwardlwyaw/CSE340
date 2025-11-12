-- Insert classification types
INSERT INTO classification (classification_name) VALUES
('home'), ('custom'), ('sedan'), ('suv'), ('truck');

-- Home
INSERT INTO inventory (make, model, year, price, mileage, description, img_full, classification_id) VALUES
('Ford', 'Fusion', 2020, 22000, 30000, 'Comfortable and efficient.', '/images/fusion.jpg', 1),
('Chevrolet', 'Malibu', 2021, 23000, 25000, 'Stylish midsize sedan.', '/images/malibu.jpg', 1),
('Honda', 'Civic', 2022, 21000, 15000, 'Reliable and sporty.', '/images/civic.jpg', 1),
('Hyundai', 'Sonata', 2020, 20000, 28000, 'Smooth ride and tech features.', '/images/sonata.jpg', 1),
('Toyota', 'Corolla', 2021, 19500, 22000, 'Fuel-efficient and safe.', '/images/corolla.jpg', 1);

-- Custom
INSERT INTO inventory (make, model, year, price, mileage, description, img_full, classification_id) VALUES
('DMC', 'Delorean', 1981, 45000, 50000, 'Iconic time-traveling coupe.', '/images/delorean.jpg', 2),
('Ford', 'Mustang GT', 2022, 55000, 10000, 'Performance tuned with custom wrap.', '/images/mustang.jpg', 2),
('Chevy', 'Camaro SS', 2021, 52000, 12000, 'Custom exhaust and body kit.', '/images/camaro.jpg', 2),
('Nissan', '370Z', 2020, 48000, 15000, 'Track-ready with carbon fiber mods.', '/images/370z.jpg', 2),
('Mazda', 'RX-7', 1995, 60000, 70000, 'Restored rotary legend.', '/images/rx7.jpg', 2);

-- Sedan
INSERT INTO inventory (make, model, year, price, mileage, description, img_full, classification_id) VALUES
('Toyota', 'Camry', 2022, 24000, 18000, 'Reliable and spacious.', '/images/camry.jpg', 3),
('Honda', 'Accord', 2021, 25000, 20000, 'Elegant and efficient.', '/images/accord.jpg', 3),
('Hyundai', 'Elantra', 2022, 19000, 12000, 'Compact and tech-savvy.', '/images/elantra.jpg', 3),
('Kia', 'K5', 2021, 22000, 17000, 'Sporty design and features.', '/images/k5.jpg', 3),
('Volkswagen', 'Passat', 2020, 21000, 30000, 'German engineering and comfort.', '/images/passat.jpg', 3);

-- SUV
INSERT INTO inventory (make, model, year, price, mileage, description, img_full, classification_id) VALUES
('Toyota', 'RAV4', 2022, 28000, 15000, 'Versatile and rugged.', '/images/rav4.jpg', 4),
('Honda', 'CR-V', 2021, 27000, 18000, 'Spacious and efficient.', '/images/crv.jpg', 4),
('Ford', 'Explorer', 2020, 32000, 25000, 'Family-friendly SUV.', '/images/explorer.jpg', 4),
('Chevrolet', 'Tahoe', 2021, 45000, 22000, 'Full-size power and comfort.', '/images/tahoe.jpg', 4),
('Jeep', 'Grand Cherokee', 2022, 40000, 16000, 'Off-road ready luxury.', '/images/cherokee.jpg', 4);

-- Truck
INSERT INTO inventory (make, model, year, price, mileage, description, img_full, classification_id) VALUES
('Ford', 'F-150', 2022, 35000, 12000, 'America’s favorite pickup.', '/images/f150.jpg', 5),
('RAM', '1500', 2021, 36000, 15000, 'Powerful and refined.', '/images/ram1500.jpg', 5),
('Chevrolet', 'Silverado', 2020, 34000, 20000, 'Built for work and play.', '/images/silverado.jpg', 5),
('Toyota', 'Tacoma', 2022, 33000, 10000, 'Reliable off-road truck.', '/images/tacoma.jpg', 5),
('GMC', 'Sierra', 2021, 37000, 14000, 'Premium pickup experience.', '/images/sierra.jpg', 5);