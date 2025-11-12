function buildVehicleDetailHTML(vehicle) {
  return `
    <div class="vehicle-detail-container">
      <img src="/images/${vehicle.img_full}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-img">
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

function buildClassificationHTML(vehicleList) {
  let html = "<div class='vehicle-grid'>";
  vehicleList.forEach(vehicle => {
    html += `
      <div class="vehicle-card">
        <img src="/images/${vehicle.img_full}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-img">
        <h2>${vehicle.make} ${vehicle.model}</h2>
        <p><strong>Year:</strong> ${vehicle.year}</p>
        <p><strong>Price:</strong> $${Number(vehicle.price).toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${Number(vehicle.mileage).toLocaleString()} miles</p>
        <a href="/inventory/detail/${vehicle.inv_id}">View Details</a>
      </div>
    `;
  });
  html += "</div>";
  return html;
}

module.exports = {
  buildVehicleDetailHTML,
  buildClassificationHTML
};