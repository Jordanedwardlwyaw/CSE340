import utilities from "./utilities.js";


utilities.handleErrors = (fn) => (req, res, next) => fn(req, res, next).catch(next);


export default utilities;