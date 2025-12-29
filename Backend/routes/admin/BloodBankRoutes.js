import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminAuthMiddleware from "../../middleware/adminAuth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import BloodBankController from "../../controllers/admin/BloodBankController.js";

const router = express.Router();

// ============= GET ENDPOINTS (Read-only) =============

/**
 * GET /admin/bloodbanks
 * List all blood banks with pagination & filters
 * Query: ?status=APPROVED&city=Mumbai&page=1&limit=20
 */
router.get(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  BloodBankController.getAllBloodBanks
);

/**
 * GET /admin/bloodbanks/id/:bloodBankId
 * Get single blood bank by MongoDB ID
 */
router.get(
  "/id/:bloodBankId",
  authMiddleware,
  adminAuthMiddleware,
  BloodBankController.getBloodBankById
);

/**
 * GET /admin/bloodbanks/code/:organizationCode
 * Get single blood bank by blood bank code (BB-MUM-001)
 */
router.get(
  "/code/:organizationCode",
  authMiddleware,
  adminAuthMiddleware,
  BloodBankController.getBloodBankByCode
);

/**
 * GET /admin/bloodbanks/status/:status
 * Get blood banks filtered by status (APPROVED, PENDING, REJECTED, SUSPENDED)
 * Query: ?page=1&limit=20
 */
router.get(
  "/status/:status",
  authMiddleware,
  adminAuthMiddleware,
  BloodBankController.getBloodBanksByStatus
);

/**
 * GET /admin/bloodbanks/:bloodBankId/stock
 * Get blood stock for a blood bank (read-only)
 */
router.get(
  "/:bloodBankId/stock",
  authMiddleware,
  adminAuthMiddleware,
  BloodBankController.getBloodBankStock
);

// ============= POST ENDPOINTS (State-changing) =============

/**
 * POST /admin/bloodbanks/:id/activate
 * Activate a suspended blood bank
 * Requires: Admin role
 */
router.post(
  "/:id/activate",
  authMiddleware,
  adminAuthMiddleware,
  roleMiddleware(["ADMIN", "SuperAdmin"]),
  BloodBankController.activateBloodBank
);

/**
 * POST /admin/bloodbanks/:id/suspend
 * Suspend a blood bank
 * Requires: Admin role
 * Body: { reason?: string }
 */
router.post(
  "/:id/suspend",
  authMiddleware,
  adminAuthMiddleware,
  roleMiddleware(["ADMIN", "SuperAdmin"]),
  BloodBankController.suspendBloodBank
);

export default router;
