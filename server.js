const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 5500;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ========== ALL VEHICLE DATA WITH PROPER CLASSIFICATION IMAGES ==========
const vehicles = [
  // ===== CLASSIC CARS (ID 1) - ONLY CLASSIC CAR IMAGES =====
  { 
    id: 1, 
    make: "DMC", 
    model: "Delorean", 
    year: 1982, 
    price: 85000, 
    miles: 12500, 
    color: "Stainless Steel", 
    description: "The iconic time-traveling sports car with gull-wing doors. Made famous by Back to the Future movies.", 
    image: "https://images.unsplash.com/photo-1519241047957-be3d40d3c197?w=800&auto=format&fit=crop&q=80", // Classic Delorean
    thumbnail: "https://images.unsplash.com/photo-1519241047957-be3d40d3c197?w=400&auto=format&fit=crop&q=80", 
    classification_id: 1 
  },
  { 
    id: 2, 
    make: "Chevrolet", 
    model: "Bel Air", 
    year: 1957, 
    price: 95000, 
    miles: 45000, 
    color: "Turquoise & White", 
    description: "Iconic American classic with chrome details and vintage styling.", 
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80", // Classic Bel Air
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80", 
    classification_id: 1 
  },
  { 
    id: 3, 
    make: "Ford", 
    model: "Mustang", 
    year: 1967, 
    price: 75000, 
    miles: 62000, 
    color: "Ruby Red", 
    description: "First generation Mustang with original V8 engine, fully restored.", 
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80", // Classic Mustang
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80", 
    classification_id: 1 
  },
  { 
    id: 19, 
    make: "Porsche", 
    model: "911 (930)", 
    year: 1978, 
    price: 185000, 
    miles: 38500, 
    color: "Guards Red", 
    description: "Classic Porsche 911 Turbo with iconic whale tail spoiler.", 
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80", // Classic Porsche 911
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80", 
    classification_id: 1 
  },
  
  // ===== SUVs (ID 2) - ONLY SUV IMAGES =====
  { 
    id: 7, 
    make: "Jeep", 
    model: "Wrangler Rubicon", 
    year: 2023, 
    price: 52800, 
    miles: 12500, 
    color: "Sting Gray", 
    description: "Off-road capable SUV with 4x4 system, rock-trac transfer case, and fox performance shocks.", 
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80", // Jeep Wrangler SUV
    thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80", 
    classification_id: 2 
  },
  { 
    id: 8, 
    make: "Cadillac", 
    model: "Escalade", 
    year: 2023, 
    price: 96800, 
    miles: 8000, 
    color: "Crystal White", 
    description: "Full-size luxury SUV with premium leather interior and advanced safety features.", 
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80", // Cadillac SUV
    thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80", 
    classification_id: 2 
  },
  { 
    id: 9, 
    make: "Toyota", 
    model: "Highlander", 
    year: 2023, 
    price: 42500, 
    miles: 10500, 
    color: "Blueprint", 
    description: "Midsize SUV with 3-row seating and excellent safety ratings.", 
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80", // Toyota SUV
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80", 
    classification_id: 2 
  },
  { 
    id: 17, 
    make: "Ford", 
    model: "Explorer", 
    year: 2023, 
    price: 45800, 
    miles: 11500, 
    color: "Agate Black", 
    description: "Three-row SUV with powerful engine and modern technology.", 
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80", // Ford SUV
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80", 
    classification_id: 2 
  },
  
  // ===== TRUCKS (ID 3) - UPDATED: ACTUAL TRUCK IMAGES =====
  { 
    id: 10, 
    make: "Ford", 
    model: "F-150", 
    year: 2023, 
    price: 55800, 
    miles: 18500, 
    color: "Oxford White", 
    description: "America's best-selling truck with 3.5L EcoBoost V6 engine.", 
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80", // Ford F-150 truck
    thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80", 
    classification_id: 3 
  },
  { 
    id: 11, 
    make: "Chevrolet", 
    model: "Silverado", 
    year: 2023, 
    price: 49800, 
    miles: 16500, 
    color: "Northsky Blue", 
    description: "Powerful pickup with trailering package and advanced technology.", 
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80", // Chevy Silverado truck
    thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80", 
    classification_id: 3 
  },
  { 
    id: 12, 
    make: "Ram", 
    model: "1500", 
    year: 2023, 
    price: 62500, 
    miles: 12500, 
    color: "Granite Crystal", 
    description: "Premium truck with air suspension and panoramic sunroof.", 
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80", // Ram 1500 truck
    thumbnail: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&auto=format&fit=crop&q=80", 
    classification_id: 3 
  },
  
  
  // ===== SEDANS (ID 4) - ONLY SEDAN IMAGES =====
  { 
    id: 4, 
    make: "Toyota", 
    model: "Camry XSE", 
    year: 2023, 
    price: 32800, 
    miles: 5500, 
    color: "Midnight Black", 
    description: "Midsize sedan with 3.5L V6 engine and sport-tuned suspension.", 
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80", // Toyota Camry sedan
    thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80", 
    classification_id: 4 
  },
  { 
    id: 5, 
    make: "Honda", 
    model: "Accord Touring", 
    year: 2023, 
    price: 36500, 
    miles: 7800, 
    color: "Platinum White", 
    description: "Comfortable sedan with hybrid powertrain and Honda Sensing safety suite.", 
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80", // Honda Accord sedan
    thumbnail: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&auto=format&fit=crop&q=80", 
    classification_id: 4 
  },
  { 
    id: 6, 
    make: "BMW", 
    model: "5 Series", 
    year: 2023, 
    price: 62500, 
    miles: 8500, 
    color: "Mineral White", 
    description: "Luxury sedan with twin-power turbo engine and live cockpit professional.", 
    image: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&auto=format&fit=crop&q=80", // BMW 5 Series sedan
    thumbnail: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=400&auto=format&fit=crop&q=80", 
    classification_id: 4 
  },
 
  { 
    id: 14, 
    make: "Tesla", 
    model: "Model 3", 
    year: 2023, 
    price: 48900, 
    miles: 6500, 
    color: "Pearl White", 
    description: "Electric sedan with autopilot and premium connectivity.", 
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80", // Tesla Model 3 sedan
    thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&auto=format&fit=crop&q=80", 
    classification_id: 4 
  },
  { 
    id: 20, 
    make: "Audi", 
    model: "A6", 
    year: 2023, 
    price: 62500, 
    miles: 7200, 
    color: "Navarra Blue", 
    description: "Premium sedan with quattro all-wheel drive and virtual cockpit.", 
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=80", // Audi A6 sedan
    thumbnail: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&auto=format&fit=crop&q=80", 
    classification_id: 4 
  }
];

const classifications = [
  { id: 1, name: "Classic Cars", description: "Vintage vehicles restored to their original glory" },
  { id: 2, name: "SUVs", description: "Sport utility vehicles perfect for family and adventure" },
  { id: 3, name: "Trucks", description: "Powerful vehicles for work and heavy-duty tasks" },
  { id: 4, name: "Sedans", description: "Comfortable and efficient daily drivers" }
];

// ========== ROUTES ==========

// Home route
app.get("/", (req, res) => {
  // Get 6 featured vehicles (2 from each category for variety)
  const featuredVehicles = [
    ...vehicles.filter(v => v.classification_id === 1).slice(0, 2), // 2 Classic
    ...vehicles.filter(v => v.classification_id === 2).slice(0, 2), // 2 SUVs
    ...vehicles.filter(v => v.classification_id === 4).slice(0, 2)  // 2 Sedans
  ];
  
  res.render("index", {
    title: "CSE Motors - Home",
    classifications: classifications,
    featuredVehicles: featuredVehicles,
    vehicles: vehicles.slice(0, 6) // Show first 6 vehicles on home
  });
});

// Classification route
app.get("/inv/type/:classificationId", (req, res) => {
  const classificationId = parseInt(req.params.classificationId);
  const classification = classifications.find(c => c.id === classificationId);
  
  if (!classification) {
    return res.status(404).render("error", {
      title: "404 - Classification Not Found",
      message: "The requested vehicle classification was not found.",
      status: 404
    });
  }
  
  const filteredVehicles = vehicles.filter(v => v.classification_id === classificationId);
  
  res.render("classification", {
    title: classification.name + " - CSE Motors",
    vehicles: filteredVehicles,
    classificationName: classification.name,
    classificationDescription: classification.description,
    classifications: classifications,
    currentClassificationId: classificationId
  });
});

// Vehicle detail route
app.get("/inv/detail/:invId", (req, res) => {
  const invId = parseInt(req.params.invId);
  const vehicle = vehicles.find(v => v.id === invId);
  
  if (!vehicle) {
    return res.status(404).render("error", {
      title: "404 - Vehicle Not Found",
      message: "The requested vehicle was not found.",
      status: 404
    });
  }
  
  const classification = classifications.find(c => c.id === vehicle.classification_id);
  
  res.render("detail", {
    title: vehicle.make + " " + vehicle.model + " - Details",
    vehicle: vehicle,
    classificationName: classification ? classification.name : "Vehicle",
    classificationDescription: classification ? classification.description : "",
    classifications: classifications
  });
});

// 500 Error test route
app.get("/inv/trigger-error", (req, res) => {
  throw new Error("Intentional 500 Error for CSE340 Assignment 3 - Testing Error Handling Middleware");
});

// ========== ERROR HANDLING ==========

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    message: "The page you requested could not be found.",
    status: 404
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).render("error", {
    title: "500 - Server Error",
    message: err.message || "An internal server error occurred.",
    status: 500
  });
});

// ========== START SERVER ==========
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`\n📊 VEHICLE CLASSIFICATION SUMMARY:`);
  classifications.forEach(classification => {
    const count = vehicles.filter(v => v.classification_id === classification.id).length;
    console.log(`   ${classification.name}: ${count} vehicles`);
  });
  console.log(`\n🔗 DIRECT CLASSIFICATION LINKS:`);
  console.log(`   Classic Cars (${vehicles.filter(v => v.classification_id === 1).length}): http://localhost:${port}/inv/type/1`);
  console.log(`   SUVs (${vehicles.filter(v => v.classification_id === 2).length}): http://localhost:${port}/inv/type/2`);
  console.log(`   Trucks (${vehicles.filter(v => v.classification_id === 3).length}): http://localhost:${port}/inv/type/3`);
  console.log(`   Sedans (${vehicles.filter(v => v.classification_id === 4).length}): http://localhost:${port}/inv/type/4`);
  console.log(`\n🚗 SAMPLE DETAIL PAGES:`);
  console.log(`   Delorean: http://localhost:${port}/inv/detail/1`);
  console.log(`   Toyota Camry: http://localhost:${port}/inv/detail/4`);
  console.log(`   Ford F-150: http://localhost:${port}/inv/detail/10`);
  console.log(`\n⚠️  500 Error Test: http://localhost:${port}/inv/trigger-error`);
});