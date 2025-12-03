const invModel = require("../models/inventory-model");
const utilities = {};

utilities.buildClassificationGrid = async function(vehicles) {
  try {
    if (!vehicles || vehicles.length === 0) {
      return '<p class="notice">No vehicles found in this classification.</p>';
    }
    
    let grid = '<div class="vehicles-grid">';
    
    vehicles.forEach(vehicle => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(vehicle.inv_price);
      
      grid += `
        <div class="vehicle-card">
          <div class="vehicle-image">
            <img src="${vehicle.inv_image}" 
                 alt="${vehicle.inv_make} ${vehicle.inv_model}">
          </div>
          <div class="vehicle-info">
            <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <div class="vehicle-price">${formattedPrice}</div>
            <p class="vehicle-description">${vehicle.inv_description}</p>
            <a href="/inv/detail/${vehicle.inv_id}" class="details-link">
              View Details
            </a>
          </div>
        </div>
      `;
    });
    
    grid += '</div>';
    return grid;
  } catch (error) {
    console.error("Error building classification grid:", error);
    return '<p class="error">Error loading vehicles.</p>';
  }
};

utilities.buildDetailView = async function(vehicle) {
  try {
    if (!vehicle) {
      return '<p class="error">Vehicle details not available.</p>';
    }
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(vehicle.inv_price);
    
    const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);
    
    return `
    <div class="detail-container">
      <div class="detail-image">
        <img src="${vehicle.inv_image}" 
             alt="${vehicle.inv_make} ${vehicle.inv_model}" 
             class="full-image">
      </div>
      <div class="detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <div class="vehicle-price">${formattedPrice}</div>
        
        <div class="specifications">
          <div class="spec-item">
            <strong>Year:</strong> ${vehicle.inv_year}
          </div>
          <div class="spec-item">
            <strong>Mileage:</strong> ${formattedMileage} miles
          </div>
          <div class="spec-item">
            <strong>Price:</strong> ${formattedPrice}
          </div>
          <div class="spec-item">
            <strong>Color:</strong> ${vehicle.inv_color}
          </div>
          <div class="spec-item">
            <strong>Classification:</strong> ${vehicle.classification_name}
          </div>
        </div>
        
        <div class="description">
          <h3>Description</h3>
          <p>${vehicle.inv_description}</p>
        </div>
      </div>
    </div>
    `;
  } catch (error) {
    console.error("Error building detail view:", error);
    return '<p class="error">Error loading vehicle details.</p>';
  }
};

utilities.getNav = async function() {
  try {
    const classifications = await invModel.getClassifications();
    let nav = '<ul>';
    nav += '<li><a href="/" title="Home page">Home</a></li>';
    
    classifications.forEach(classification => {
      nav += `<li><a href="/inv/type/${classification.classification_id}" 
              title="View our ${classification.classification_name} inventory">
              ${classification.classification_name}</a></li>`;
    });
    
    nav += '</ul>';
    return nav;
  } catch (error) {
    console.error('Error building navigation:', error);
    return '<ul><li><a href="/">Home</a></li></ul>';
  }
};

module.exports = utilities;