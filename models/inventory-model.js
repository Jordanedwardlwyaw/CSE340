// inventory-model.js
const inventory = [
  // Sedans
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    type: "Sedan",
    image: "/images/sedan1.jpg",
    description: "A comfortable family sedan",
    price: 25000,
    mileage: 12000
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    type: "Sedan",
    image: "/images/sedan2.jpg",
    description: "Reliable and fuel-efficient",
    price: 22000,
    mileage: 8000
  },
  // SUVs
  {
    id: 3,
    make: "Toyota",
    model: "RAV4",
    type: "SUV",
    image: "/images/suv1.jpg",
    description: "Spacious and versatile SUV",
    price: 32000,
    mileage: 15000
  },
  {
    id: 4,
    make: "Honda",
    model: "CR-V",
    type: "SUV",
    image: "/images/suv2.jpg",
    description: "Comfortable SUV with great mileage",
    price: 31000,
    mileage: 13000
  },
  // Trucks
  {
    id: 5,
    make: "Ford",
    model: "F-150",
    type: "Truck",
    image: "/images/truck1.jpg",
    description: "Reliable work truck",
    price: 40000,
    mileage: 20000
  },
  {
    id: 6,
    make: "Chevrolet",
    model: "Silverado",
    type: "Truck",
    image: "/images/truck2.jpg",
    description: "Powerful and durable",
    price: 42000,
    mileage: 18000
  },
  // Custom Car
  {
    id: 7,
    make: "DMC",
    model: "Delorean",
    type: "Custom",
    image: "/images/delorean.jpg",
    description: "Classic time-traveling car"
  }
];

module.exports = {
  getVehiclesByType: (type) => inventory.filter(v => v.type.toLowerCase() === type.toLowerCase()),
  getVehicleById: (id) => inventory.find(v => v.id == id),
  getCustomUpgrades: () => [
    { name: "Flux Capacitor", image: "/images/flux-capacitor.jpg" },
    { name: "Flame Decals", image: "/images/flame-decals.jpg" },
    { name: "Bumper Stickers", image: "/images/bumper-stickers.jpg" },
    { name: "Hub Caps", image: "/images/hubcaps.jpg" }
  ]
};
