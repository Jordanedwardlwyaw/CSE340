import pool from "../database/index.js";


const utilities = {};


utilities.getNav = async function () {
const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
let nav = '<ul class="navigation">';
nav += '<li><a href="/">Home</a></li>';
result.rows.forEach((row) => {
nav += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`;
});
nav += '</ul>';
return nav;
};


utilities.buildClassificationGrid = function (data) {
let grid = '<ul class="inv-grid">';
data.forEach((car) => {
grid += `<li><a href="/inv/detail/${car.inv_id}"><img src="${car.inv_thumbnail}" alt="${car.inv_model}"><h2>${car.inv_make} ${car.inv_model}</h2></a></li>`;
});
grid += '</ul>';
return grid;
};


export default utilities;