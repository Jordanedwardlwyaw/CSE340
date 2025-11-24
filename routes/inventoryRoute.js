import express from "express";
import invController from "../controllers/invController.js";
import utilities from "../utilities/index.js";


const router = express.Router();


router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/type/:classification_id", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));


export default router;