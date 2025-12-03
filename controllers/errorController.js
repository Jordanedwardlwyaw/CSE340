const utilities = require("../utilities/");

const errorCont = {};

// Trigger intentional error for assignment
errorCont.triggerError = async function (req, res, next) {
    try {
        // Intentional error - this will trigger 500
        throw new Error("Intentional 500 Error - Testing Error Handling Middleware for CSE340 Assignment 3");
    } catch (error) {
        next(error);
    }
};

// Handle 404 errors
errorCont.handle404 = async function (req, res, next) {
    next({status: 404, message: "Sorry, the page you requested could not be found."});
};

module.exports = errorCont;