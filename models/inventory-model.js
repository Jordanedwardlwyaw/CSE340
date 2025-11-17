const inventory = [
  // -------------------- SEDANS --------------------
  {
    id: 101,
    classification: 'Sedan',
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    price: 30000,
    mileage: 12000,
    description: 'A reliable mid-size sedan with excellent fuel efficiency.',
    image: '/images/sedans/honda-accord.jpg',
    thumbnail: '/images/sedans/honda-accord-thumb.jpg'
  },
  {
    id: 102,
    classification: 'Sedan',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 32000,
    mileage: 8000,
    description: 'A comfortable sedan with modern technology and great safety ratings.',
    image: '/images/sedans/toyota-camry.jpg',
    thumbnail: '/images/sedans/toyota-camry-thumb.jpg'
  },

  // -------------------- SUVS --------------------
  {
    id: 201,
    classification: 'SUV',
    make: 'Toyota',
    model: 'RAV4',
    year: 2024,
    price: 35000,
    mileage: 5000,
    description: 'A compact SUV with excellent fuel efficiency and cargo space.',
    image: '/images/suvs/toyota-rav4.jpg',
    thumbnail: '/images/suvs/toyota-rav4-thumb.jpg'
  },
  {
    id: 202,
    classification: 'SUV',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 36000,
    mileage: 9000,
    description: 'A spacious SUV with a smooth ride and advanced technology.',
    image: '/images/suvs/honda-crv.jpg',
    thumbnail: '/images/suvs/honda-crv-thumb.jpg'
  },

  // -------------------- TRUCKS --------------------
  {
    id: 301,
    classification: 'Truck',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 45000,
    mileage: 15000,
    description: 'A powerful truck built for towing and hauling heavy loads.',
    image: '/images/trucks/ford-f150.jpg',
    thumbnail: '/images/trucks/ford-f150-thumb.jpg'
  },
  {
    id: 302,
    classification: 'Truck',
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2024,
    price: 47000,
    mileage: 12000,
    description: 'Durable truck with advanced technology and strong performance.',
    image: '/images/trucks/chevy-silverado.jpg',
    thumbnail: '/images/trucks/chevy-silverado-thumb.jpg'
  }
];

function getVehiclesByClassification(classification) {
  return inventory.filter(vehicle => vehicle.classification === classification);
}

function getVehicleById(id) {
  return inventory.find(vehicle => vehicle.id === parseInt(id));
}

module.exports = { getVehiclesByClassification, getVehicleById };
