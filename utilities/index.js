function buildVehicleDetailHTML(vehicle) {
  return `
    <div class="vehicle-detail-container">
      <img src="${vehicle.img_full}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-img">
      <div class="vehicle-info">
        <h1>${vehicle.make} ${vehicle.model}</h1>
        <p><strong>Year:</strong> ${vehicle.year}</p>
        <p><strong>Price:</strong> $${Number(vehicle.price).toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${Number(vehicle.mileage).toLocaleString()} miles</p>
        <p>${vehicle.description}</p>
      </div>
    </div>
  `;
}

module.exports = { buildVehicleDetailHTML };
