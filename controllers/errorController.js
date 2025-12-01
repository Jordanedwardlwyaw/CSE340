const errorController = {};

errorController.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 Error - Testing error handling middleware for Assignment 3");
};

module.exports = errorController;