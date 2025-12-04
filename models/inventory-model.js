const mockData = {
  vehicles: [
    // ===== CLASSIC CARS (ID 1) =====
  
    {
      inv_id: 2,
      inv_make: "Chevrolet",
      inv_model: "Bel Air",
      inv_year: 1957,
      inv_description: "Iconic American classic with chrome details and vintage styling.",
      inv_image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80",
      inv_price: 95000,
      inv_miles: 45000,
      inv_color: "Turquoise & White",
      classification_id: 1,
      classification_name: "Classic Cars"
    },
    {
      inv_id: 3,
      inv_make: "Ford",
      inv_model: "Mustang",
      inv_year: 1967,
      inv_description: "First generation Mustang with original V8 engine, fully restored.",
      inv_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80",
      inv_price: 75000,
      inv_miles: 62000,
      inv_color: "Ruby Red",
      classification_id: 1,
      classification_name: "Classic Cars"
    },
    {
      inv_id: 19,
      inv_make: "Porsche",
      inv_model: "911 (930)",
      inv_year: 1978,
      inv_description: "Classic Porsche 911 Turbo with iconic whale tail spoiler.",
      inv_image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
      inv_price: 185000,
      inv_miles: 38500,
      inv_color: "Guards Red",
      classification_id: 1,
      classification_name: "Classic Cars"
    },
    
    // ===== SUVs (ID 2) =====
    {
      inv_id: 7,
      inv_make: "Jeep",
      inv_model: "Wrangler Rubicon",
      inv_year: 2023,
      inv_description: "Off-road capable SUV with 4x4 system, rock-trac transfer case, and fox performance shocks.",
      inv_image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80",
      inv_price: 52800,
      inv_miles: 12500,
      inv_color: "Sting Gray",
      classification_id: 2,
      classification_name: "SUVs"
    },
    {
      inv_id: 8,
      inv_make: "Cadillac",
      inv_model: "Escalade",
      inv_year: 2023,
      inv_description: "Full-size luxury SUV with premium leather interior and advanced safety features.",
      inv_image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80",
      inv_price: 96800,
      inv_miles: 8000,
      inv_color: "Crystal White",
      classification_id: 2,
      classification_name: "SUVs"
    },
    {
      inv_id: 9,
      inv_make: "Toyota",
      inv_model: "Highlander",
      inv_year: 2023,
      inv_description: "Midsize SUV with 3-row seating and excellent safety ratings.",
      inv_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80",
      inv_price: 42500,
      inv_miles: 10500,
      inv_color: "Blueprint",
      classification_id: 2,
      classification_name: "SUVs"
    },
    {
      inv_id: 17,
      inv_make: "Ford",
      inv_model: "Explorer",
      inv_year: 2023,
      inv_description: "Three-row SUV with powerful engine and modern technology.",
      inv_image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&auto=format&fit=crop&q=80",
      inv_price: 45800,
      inv_miles: 11500,
      inv_color: "Agate Black",
      classification_id: 2,
      classification_name: "SUVs"
    },
    
    // ===== TRUCKS (ID 3) =====
    {
      inv_id: 10,
      inv_make: "Ford",
      inv_model: "F-150",
      inv_year: 2023,
      inv_description: "America's best-selling truck with 3.5L EcoBoost V6 engine.",
      inv_image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&auto=format&fit=crop&q=80",
      inv_price: 55800,
      inv_miles: 18500,
      inv_color: "Oxford White",
      classification_id: 3,
      classification_name: "Trucks"
    },
    {
      inv_id: 11,
      inv_make: "Chevrolet",
      inv_model: "Silverado",
      inv_year: 2023,
      inv_description: "Powerful pickup with trailering package and advanced technology.",
      inv_image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80",
      inv_price: 49800,
      inv_miles: 16500,
      inv_color: "Northsky Blue",
      classification_id: 3,
      classification_name: "Trucks"
    },
    {
      inv_id: 12,
      inv_make: "Ram",
      inv_model: "1500",
      inv_year: 2023,
      inv_description: "Premium truck with air suspension and panoramic sunroof.",
      inv_image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80",
      inv_price: 62500,
      inv_miles: 12500,
      inv_color: "Granite Crystal",
      classification_id: 3,
      classification_name: "Trucks"
    },
    {
      inv_id: 18,
      inv_make: "Toyota",
      inv_model: "Tundra",
      inv_year: 2023,
      inv_description: "Full-size pickup with hybrid powertrain and advanced towing technology.",
      inv_image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
      inv_price: 52500,
      inv_miles: 9500,
      inv_color: "Lunar Rock",
      classification_id: 3,
      classification_name: "Trucks"
    },
    
    // ===== SEDANS (ID 4) =====
    {
      inv_id: 4,
      inv_make: "Toyota",
      inv_model: "Camry XSE",
      inv_year: 2023,
      inv_description: "Midsize sedan with 3.5L V6 engine and sport-tuned suspension.",
      inv_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80",
      inv_price: 32800,
      inv_miles: 5500,
      inv_color: "Midnight Black",
      classification_id: 4,
      classification_name: "Sedans"
    },
    {
      inv_id: 5,
      inv_make: "Honda",
      inv_model: "Accord Touring",
      inv_year: 2023,
      inv_description: "Comfortable sedan with hybrid powertrain and Honda Sensing safety suite.",
      inv_image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&auto=format&fit=crop&q=80",
      inv_price: 36500,
      inv_miles: 7800,
      inv_color: "Platinum White",
      classification_id: 4,
      classification_name: "Sedans"
    },
    
    {
      inv_id: 13,
      inv_make: "Mercedes",
      inv_model: "E-Class",
      inv_year: 2023,
      inv_description: "Executive sedan with advanced driver assistance systems.",
      inv_image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop&q=80",
      inv_price: 68500,
      inv_miles: 5200,
      inv_color: "Obsidian Black",
      classification_id: 4,
      classification_name: "Sedans"
    },
    {
      inv_id: 14,
      inv_make: "Tesla",
      inv_model: "Model 3",
      inv_year: 2023,
      inv_description: "Electric sedan with autopilot and premium connectivity.",
      inv_image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop&q=80",
      inv_price: 48900,
      inv_miles: 6500,
      inv_color: "Pearl White",
      classification_id: 4,
      classification_name: "Sedans"
    },
    {
      inv_id: 20,
      inv_make: "Audi",
      inv_model: "A6",
      inv_year: 2023,
      inv_description: "Premium sedan with quattro all-wheel drive and virtual cockpit.",
      inv_image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=80",
      inv_thumbnail: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&auto=format&fit=crop&q=80",
      inv_price: 62500,
      inv_miles: 7200,
      inv_color: "Navarra Blue",
      classification_id: 4,
      classification_name: "Sedans"
    }
  ],
  
  classifications: [
    { 
      classification_id: 1, 
      classification_name: "Classic Cars",
      classification_description: "Vintage vehicles restored to their original glory"
    },
    { 
      classification_id: 2, 
      classification_name: "SUVs",
      classification_description: "Sport utility vehicles perfect for family and adventure"
    },
    { 
      classification_id: 3, 
      classification_name: "Trucks",
      classification_description: "Powerful vehicles for work and heavy-duty tasks"
    },
    { 
      classification_id: 4, 
      classification_name: "Sedans",
      classification_description: "Comfortable and efficient daily drivers"
    }
  ]
};

module.exports = {
  getInventoryByClassificationId: async (id) => {
    return mockData.vehicles.filter(v => v.classification_id == id);
  },
  
  getVehicleById: async (id) => {
    return mockData.vehicles.find(v => v.inv_id == id) || mockData.vehicles[0];
  },

  getInventoryById: async (id) => {
    return mockData.vehicles.find(v => v.inv_id == id) || mockData.vehicles[0];
  },
  
  getClassifications: async () => {
    return mockData.classifications;
  },
  
  getClassificationById: async (id) => {
    return mockData.classifications.find(c => c.classification_id == id);
  },
  
  getFeaturedVehicles: async () => {
    const classicCars = mockData.vehicles
      .filter(v => v.classification_id === 1)
      .slice(0, 2);
    
    const suvs = mockData.vehicles
      .filter(v => v.classification_id === 2)
      .slice(0, 2);
    
    const sedans = mockData.vehicles
      .filter(v => v.classification_id === 4)
      .slice(0, 2);
    
    return [...classicCars, ...suvs, ...sedans];
  },
  
  getAllVehicles: async () => {
    return mockData.vehicles.slice(0, 6);
  },

  // NEW FUNCTIONS FOR ASSIGNMENT 4
  addClassification: async (classification_name) => {
    try {
      // Generate new ID
      const newId = mockData.classifications.length > 0 
        ? Math.max(...mockData.classifications.map(c => c.classification_id)) + 1 
        : 1;
      
      // Create new classification
      const newClassification = {
        classification_id: newId,
        classification_name: classification_name,
        classification_description: `${classification_name} vehicles`
      };
      
      // Add to mock data
      mockData.classifications.push(newClassification);
      
      console.log(`✅ Added new classification: ${classification_name} (ID: ${newId})`);
      return newClassification;
    } catch (error) {
      console.error("Mock Model Error: addClassification", error);
      throw error;
    }
  },
  
  addInventoryItem: async (inventoryData) => {
    try {
      // Generate new ID
      const newId = mockData.vehicles.length > 0
        ? Math.max(...mockData.vehicles.map(v => v.inv_id)) + 1
        : 21;
      
      // Find classification name
      const classification = mockData.classifications.find(
        c => c.classification_id == inventoryData.classification_id
      );
      
      // Create new vehicle
      const newVehicle = {
        inv_id: newId,
        inv_make: inventoryData.inv_make,
        inv_model: inventoryData.inv_model,
        inv_year: parseInt(inventoryData.inv_year),
        inv_description: inventoryData.inv_description,
        inv_image: inventoryData.inv_image || "/images/vehicles/no-image.png",
        inv_thumbnail: inventoryData.inv_thumbnail || "/images/vehicles/no-image-tn.png",
        inv_price: parseFloat(inventoryData.inv_price),
        inv_miles: parseInt(inventoryData.inv_miles),
        inv_color: inventoryData.inv_color,
        classification_id: parseInt(inventoryData.classification_id),
        classification_name: classification ? classification.classification_name : "Unknown"
      };
      
      // Add to mock data
      mockData.vehicles.push(newVehicle);
      
      console.log(`✅ Added new vehicle: ${newVehicle.inv_make} ${newVehicle.inv_model} (ID: ${newId})`);
      return newVehicle;
    } catch (error) {
      console.error("Mock Model Error: addInventoryItem", error);
      throw error;
    }
  }
};