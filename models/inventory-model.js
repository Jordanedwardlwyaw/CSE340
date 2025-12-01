// Mock data
const mockData = {
  vehicles: [
    {
      inv_id: 1,
      inv_make: "DMC",
      inv_model: "Delorean",
      inv_year: 1982,
      inv_description: "The iconic time-traveling sports car with gull-wing doors and stainless steel body.",
      inv_image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop",
      inv_price: 35000,
      inv_miles: 15000,
      inv_color: "Stainless Steel",
      classification_id: 1,
      classification_name: "Sports Cars"
    },
    {
      inv_id: 2,
      inv_make: "Ford",
      inv_model: "Mustang",
      inv_year: 1965,
      inv_description: "Classic American muscle car with powerful V8 engine.",
      inv_image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop",
      inv_price: 45000,
      inv_miles: 25000,
      inv_color: "Red",
      classification_id: 1,
      classification_name: "Sports Cars"
    },
    {
      inv_id: 3,
      inv_make: "Jeep",
      inv_model: "Wrangler",
      inv_year: 2022,
      inv_description: "Off-road capable SUV for adventure seekers.",
      inv_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop",
      inv_price: 38000,
      inv_miles: 12000,
      inv_color: "Black",
      classification_id: 2,
      classification_name: "SUVs"
    },
    {
      inv_id: 4,
      inv_make: "Chevrolet",
      inv_model: "Silverado",
      inv_year: 2021,
      inv_description: "Powerful pickup truck with towing capacity.",
      inv_image: "https://images.unsplash.com/photo-1563720223485-8d6d5c5c8c7b?w=600&auto=format&fit=crop",
      inv_price: 42000,
      inv_miles: 18000,
      inv_color: "White",
      classification_id: 3,
      classification_name: "Trucks"
    }
  ],
  classifications: [
    { classification_id: 1, classification_name: "Sports Cars" },
    { classification_id: 2, classification_name: "SUVs" },
    { classification_id: 3, classification_name: "Trucks" },
    { classification_id: 4, classification_name: "Classic Cars" }
  ]
};

module.exports = {
  getInventoryByClassificationId: async (id) => {
    return mockData.vehicles.filter(v => v.classification_id == id);
  },
  
  getVehicleById: async (id) => {
    return mockData.vehicles.find(v => v.inv_id == id) || mockData.vehicles[0];
  },
  
  getClassifications: async () => {
    return mockData.classifications;
  }
};