import express from "express";
import { DebugController } from "../controllers/DebugController.js";

const router = express.Router();

/**
 * Debug Routes - For development only
 */

// Check if organization and hospital exist for given ID
router.get("/check/:id", DebugController.checkOrganizationAndHospital);

// List all hospitals
router.get("/hospitals", DebugController.listAllHospitals);

// List all organizations
router.get("/organizations", DebugController.listAllOrganizations);

export default router;
