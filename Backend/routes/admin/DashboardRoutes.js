import express from "express";
import {
  getDashboardOverview,
  getOrganizationStats,
  getBloodStockStats,
  getAlertStats,
  getUserStats,
  getRecentActivity,
  getSystemHealth,
  getGrowthTrends,
  getBloodTypeBreakdown,
  getActiveUsersTrend
} from "../../controllers/admin/DashboardController.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminAuthMiddleware from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

/**
 * Dashboard Routes
 * All endpoints require admin authentication
 * Base path: /api/admin/dashboard
 */

/**
 * GET /api/admin/dashboard/overview
 * Get complete dashboard overview with all statistics
 * Returns: organizations, blood stock, alerts, users, recent activity, system health
 */
router.get("/overview", authMiddleware, adminAuthMiddleware, getDashboardOverview);

/**
 * GET /api/admin/dashboard/organizations
 * Get detailed organization statistics
 * Returns: total, hospitals, bloodBanks, ngos, pending, approved, suspended
 */
router.get("/organizations", authMiddleware, adminAuthMiddleware, getOrganizationStats);

/**
 * GET /api/admin/dashboard/blood-stock
 * Get detailed blood stock statistics
 * Returns: total units available, critical blood banks, total blood banks, status
 */
router.get("/blood-stock", authMiddleware, adminAuthMiddleware, getBloodStockStats);

/**
 * GET /api/admin/dashboard/alerts
 * Get detailed alert statistics
 * Returns: total alerts, unread count, critical/high severity counts, alerts by type
 */
router.get("/alerts", authMiddleware, adminAuthMiddleware, getAlertStats);

/**
 * GET /api/admin/dashboard/users
 * Get detailed user statistics
 * Returns: organization users, system admins, total users
 */
router.get("/users", authMiddleware, adminAuthMiddleware, getUserStats);

/**
 * GET /api/admin/dashboard/activity
 * Get recent activity logs
 * Query params:
 *   - limit: Number of logs (default: 10, max: 50)
 * Returns: count, logs array with timestamp, action, entity details
 */
router.get("/activity", authMiddleware, adminAuthMiddleware, getRecentActivity);

/**
 * GET /api/admin/dashboard/health
 * Get system health status
 * Returns: database connection status, all collections status and document counts
 */
router.get("/health", authMiddleware, adminAuthMiddleware, getSystemHealth);

/**
 * GET /api/admin/dashboard/growth-trends
 * Get organization growth trends for last 6 months
 * Returns: array of monthly data with hospitals, ngos, banks counts
 */
router.get("/growth-trends", authMiddleware, adminAuthMiddleware, getGrowthTrends);

/**
 * GET /api/admin/dashboard/blood-types
 * Get blood type inventory breakdown
 * Returns: array of blood types with units available (O+, O-, A+, A-, B+, B-, AB+, AB-)
 */
router.get("/blood-types", authMiddleware, adminAuthMiddleware, getBloodTypeBreakdown);

/**
 * GET /api/admin/dashboard/active-users
 * Get active users trend for last 6 months
 * Returns: array of monthly data with active users and new users counts
 */
router.get("/active-users", authMiddleware, adminAuthMiddleware, getActiveUsersTrend);

export default router;
