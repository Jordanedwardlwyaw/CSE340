// Build classification grid
async function buildClassificationGrid(data) {
    try {
        if (!data || data.length === 0) {
            return '<p class="no-data">No vehicles found in this classification.</p>';
        }
        
        let grid = '<div class="vehicles-grid">';
        
        data.forEach(vehicle => {
            // Format price with commas
            const formattedPrice = new Intl.NumberFormat('en-US').format(vehicle.inv_price);
            
            grid += `
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        <img src="${vehicle.inv_image || '/images/placeholder.jpg'}" 
                             alt="${vehicle.inv_make} ${vehicle.inv_model}">
                    </div>
                    <div class="vehicle-info">
                        <h2 class="vehicle-name">
                            ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
                        </h2>
                        <div class="vehicle-price">
                            $${formattedPrice}
                        </div>
                        <p class="vehicle-description">
                            ${vehicle.inv_description || 'No description available.'}
                        </p>
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
        return '<p class="error">Error loading vehicles. Please try again later.</p>';
    }
}