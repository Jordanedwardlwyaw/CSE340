document.addEventListener("DOMContentLoaded", () => {
  const inventoryList = document.getElementById("inventory-list");

  if (inventoryList) {
    // Example static data; replace with fetch from backend later
    const vehicles = [
      { make: "Toyota", model: "Corolla", year: 2020 },
      { make: "Ford", model: "Mustang", year: 2018 },
      { make: "Honda", model: "Civic", year: 2022 }
    ];

    vehicles.forEach(vehicle => {
      const li = document.createElement("li");
      li.textContent = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      inventoryList.appendChild(li);
    });
  }
});