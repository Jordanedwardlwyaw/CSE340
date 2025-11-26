const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "cse340-secret-key",
  resave: false,
  saveUninitialized: true,
  name: 'sessionId'
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Mock data for navigation
const mockNavData = [
  { classification_name: "Classic", classification_id: 1 },
  { classification_name: "Sports", classification_id: 2 },
  { classification_name: "SUV", classification_id: 3 },
  { classification_name: "Truck", classification_id: 4 },
  { classification_name: "Used", classification_id: 5 }
];

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors - Home",
    nav: mockNavData
  });
});

// Management routes
app.get("/inv", (req, res) => {
  res.render("./inventory/management", {
    title: "Vehicle Management - CSE Motors",
    nav: mockNavData,
    message: req.flash('message') || null
  });
});

app.get("/inv/add-classification", (req, res) => {
  res.render("./inventory/add-classification", {
    title: "Add Classification - CSE Motors",
    nav: mockNavData,
    message: req.flash('message') || null,
    errors: req.flash('errors') || null
  });
});

app.get("/inv/add-inventory", (req, res) => {
  const classificationList = `
    <select name="classification_id" id="classificationList" required>
      <option value="">Choose a Classification</option>
      <option value="1">Classic</option>
      <option value="2">Sports</option>
      <option value="3">SUV</option>
      <option value="4">Truck</option>
      <option value="5">Used</option>
    </select>
  `;
  
  res.render("./inventory/add-inventory", {
    title: "Add Inventory - CSE Motors",
    nav: mockNavData,
    message: req.flash('message') || null,
    errors: req.flash('errors') || null,
    classificationList: classificationList,
    invData: req.flash('invData') || null
  });
});

// Classification routes - UPDATED with different cars for each classification
app.get("/inv/type/:classificationId", (req, res) => {
  const classificationId = req.params.classificationId;
  const classificationNames = {
    "1": "Classic",
    "2": "Sports", 
    "3": "SUV",
    "4": "Truck",
    "5": "Used"
  };
  
  const classificationName = classificationNames[classificationId] || "Vehicles";
  
  // Different vehicle data for each classification
  const vehicleData = {
    "1": [ // Classic Cars
      {
        id: 101,
        name: "1965 Ford Mustang",
        year: 1965,
        price: "$45,000",
        color: "Red",
        description: "Beautifully restored classic Mustang",
        image: "/images/vehicles/classic-mustang.jpg"
      },
      {
        id: 102,
        name: "1957 Chevrolet Bel Air",
        year: 1957,
        price: "$65,000",
        color: "Turquoise",
        description: "Iconic American classic in excellent condition",
        image: "/images/vehicles/classic-belair.jpg"
      },
      {
        id: 103,
        name: "1969 Volkswagen Beetle",
        year: 1969,
        price: "$25,000",
        color: "Yellow",
        description: "Fully restored classic Beetle",
        image: "/images/vehicles/classic-beetle.jpg"
      }
    ],
    "2": [ // Sports Cars
      {
        id: 201,
        name: "2023 Chevrolet Corvette",
        year: 2023,
        price: "$72,000",
        color: "Red",
        description: "Brand new Corvette with premium package",
        image: "/images/vehicles/sports-corvette.jpg"
      },
      {
        id: 202,
        name: "2024 Porsche 911",
        year: 2024,
        price: "$115,000",
        color: "White",
        description: "Luxury sports car with all options",
        image: "/images/vehicles/sports-porsche.jpg"
      },
      {
        id: 203,
        name: "2023 Ford Mustang GT",
        year: 2023,
        price: "$48,000",
        color: "Blue",
        description: "Powerful muscle car with premium sound",
        image: "/images/vehicles/sports-mustang.jpg"
      }
    ],
    "3": [ // SUVs
      {
        id: 301,
        name: "2024 Ford Explorer",
        year: 2024,
        price: "$42,000",
        color: "Black",
        description: "Spacious family SUV with third row",
        image: "/images/vehicles/suv-explorer.jpg"
      },
      {
        id: 302,
        name: "2023 Toyota Highlander",
        year: 2023,
        price: "$38,500",
        color: "Silver",
        description: "Reliable SUV with great fuel economy",
        image: "/images/vehicles/suv-highlander.jpg"
      },
      {
        id: 303,
        name: "2024 Jeep Grand Cherokee",
        year: 2024,
        price: "$52,000",
        color: "Green",
        description: "Premium SUV with off-road capability",
        image: "/images/vehicles/suv-jeep.jpg"
      }
    ],
    "4": [ // Trucks
      {
        id: 401,
        name: "2024 Ford F-150",
        year: 2024,
        price: "$45,000",
        color: "White",
        description: "America's best-selling truck",
        image: "/images/vehicles/truck-f150.jpg"
      },
      {
        id: 402,
        name: "2023 Chevrolet Silverado",
        year: 2023,
        price: "$43,500",
        color: "Black",
        description: "Powerful work truck with towing package",
        image: "/images/vehicles/truck-silverado.jpg"
      },
      {
        id: 403,
        name: "2024 Ram 1500",
        year: 2024,
        price: "$47,000",
        color: "Red",
        description: "Luxury truck with premium interior",
        image: "/images/vehicles/truck-ram.jpg"
      }
    ],
    "5": [ // Used Cars
      {
        id: 501,
        name: "2019 Honda Civic",
        year: 2019,
        price: "$18,500",
        color: "Gray",
        description: "Well-maintained with low mileage",
        image: "/images/vehicles/used-civic.jpg"
      },
      {
        id: 502,
        name: "2018 Toyota Camry",
        year: 2018,
        price: "$16,000",
        color: "Blue",
        description: "Single owner, excellent condition",
        image: "/images/vehicles/used-camry.jpg"
      },
      {
        id: 503,
        name: "2020 Hyundai Elantra",
        year: 2020,
        price: "$14,500",
        color: "White",
        description: "Certified pre-owned with warranty",
        image: "/images/vehicles/used-elantra.jpg"
      }
    ]
  };
  
  const vehicles = vehicleData[classificationId] || [
    {
      id: 1,
      name: `Sample ${classificationName} Car`,
      year: 2023,
      price: "$25,000",
      color: "Red",
      description: "Sample vehicle description",
      image: "/images/vehicles/no-image.png"
    }
  ];
  
  res.render("./inventory/classification", {
    title: `${classificationName} - CSE Motors`,
    nav: mockNavData,
    classificationName: classificationName,
    classificationId: classificationId,
    vehicles: vehicles
  });
});

// Inventory detail route - UPDATED
app.get("/inv/detail/:inventoryId", (req, res) => {
  const inventoryId = parseInt(req.params.inventoryId);
  
  // Sample vehicle details
  const vehicleDetails = {
    101: {
      name: "1965 Ford Mustang",
      year: 1965,
      price: "$45,000",
      color: "Red",
      mileage: "85,000 miles",
      description: "Beautifully restored 1965 Ford Mustang. This classic American muscle car features a V8 engine, manual transmission, and has been completely restored to its original glory.",
      features: ["V8 Engine", "Manual Transmission", "Power Steering", "AM/FM Radio", "Restored Interior"]
    },
    201: {
      name: "2023 Chevrolet Corvette",
      year: 2023,
      price: "$72,000",
      color: "Red",
      mileage: "5,000 miles",
      description: "Brand new 2023 Chevrolet Corvette Stingray. This premium sports car features a 6.2L V8 engine and all the latest technology.",
      features: ["6.2L V8 Engine", "8-Speed Automatic", "Leather Interior", "Premium Sound"]
    },
    301: {
      name: "2024 Ford Explorer",
      year: 2024,
      price: "$42,000",
      color: "Black",
      mileage: "2,000 miles",
      description: "Spacious family SUV with third row seating. Perfect for family trips and daily commuting.",
      features: ["Third Row Seating", "Premium Sound", "Navigation System", "Leather Seats"]
    }
  };
  
  const vehicle = vehicleDetails[inventoryId] || {
    name: "Sample Vehicle",
    year: 2023,
    price: "$25,000",
    color: "Red",
    mileage: "15,000 miles",
    description: "This is a sample vehicle description.",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };
  
  res.render("./inventory/detail", {
    title: `${vehicle.name} - CSE Motors`,
    nav: mockNavData,
    vehicle: vehicle,
    inventoryId: inventoryId
  });
});

// POST routes for forms
app.post("/inv/add-classification", (req, res) => {
  const { classification_name } = req.body;
  
  if (!classification_name || classification_name.trim() === '') {
    req.flash('error', 'Classification name is required');
    return res.redirect("/inv/add-classification");
  }
  
  req.flash('success', 'Classification added successfully!');
  res.redirect("/inv");
});

app.post("/inv/add-inventory", (req, res) => {
  req.flash('success', 'Vehicle added successfully!');
  res.redirect("/inv");
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found - CSE Motors",
    nav: mockNavData,
    message: "Sorry, the page you requested doesn't exist."
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/error", {
    title: "Server Error - CSE Motors",
    nav: mockNavData,
    message: "Something went wrong on our end. Please try again later."
  });
});

// Function to start server on available port
function startServer(port = 4000) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📁 Serving from: ${__dirname}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

// Start the server
startServer(4000);