function buildVehicleDetailHTML(vehicle) {
  return `
    <div class="vehicle-detail">
      <h1>${vehicle.make} ${vehicle.model}</h1>
      <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" />
      <p>Year: ${vehicle.year}</p>
      <p>Price: $${vehicle.price.toLocaleString()}</p>
      <p>Mileage: ${vehicle.mileage.toLocaleString()} miles</p>
      <p>${vehicle.description}</p>
    </div>
  `;
}

module.exports = { buildVehicleDetailHTML };
