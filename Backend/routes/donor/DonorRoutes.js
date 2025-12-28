import express from "express";
import {
	registerDonorForCamp,
	recordDonation
} from "../../controllers/Donor/DonorController.js";

const router = express.Router();

// Donor camp registration (NO LOGIN)
router.post("/register", registerDonorForCamp);

// Record a completed donation and update donor stats
router.post("/donate", recordDonation);

export default router;
