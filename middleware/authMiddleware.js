// Static files
app.use(express.static(path.join(__dirname, "public")));

// ADD THIS MIDDLEWARE - Make nav available to all views
app.use((req, res, next) => {
  res.locals.nav = [
    { classification_name: "Classic", classification_id: 1 },
    { classification_name: "Sports", classification_id: 2 },
    { classification_name: "SUV", classification_id: 3 },
    { classification_name: "Truck", classification_id: 4 },
    { classification_name: "Used", classification_id: 5 }
  ];
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors - Home"
    // Remove nav from here since it's now in res.locals
  });
});