exports.inventory = {
  home: {
    banner: "/images/home-banner.jpg",
    message: "Welcome to CSE Motors!"
  },

  classifications: {
    Sedan: [
      { id: 1, make: "Toyota", model: "Corolla", description: "Reliable", image: "/images/sedan1.jpg" },
      { id: 2, make: "Honda", model: "Civic", description: "Sporty", image: "/images/sedan2.jpg" }
    ],

    SUV: [
      { id: 3, make: "Toyota", model: "RAV4", description: "Compact SUV", image: "/images/suv1.jpg" },
      { id: 4, make: "Ford", model: "Explorer", description: "Strong", image: "/images/suv2.jpg" }
    ],

    Truck: [
      { id: 5, make: "Ford", model: "F-150", description: "Powerful", image: "/images/truck1.jpg" },
      { id: 6, make: "Chevrolet", model: "Silverado", description: "Heavy duty", image: "/images/truck2.jpg" }
    ],

    Custom: {
      baseCar: {
        id: 7,
        make: "DMC",
        model: "Delorean",
        description: "Retro classic",
        image: "/images/delorean.jpg"
      },
      upgrades: [
        { name: "Flux Capacitor", image: "/images/flux-capacitor.jpg" },
        { name: "Flame Decals", image: "/images/flame-decals.jpg" },
        { name: "Bumper Stickers", image: "/images/bumper-stickers.jpg" },
        { name: "Hub Caps", image: "/images/hubcaps.jpg" }
      ]
    }
  }
};
