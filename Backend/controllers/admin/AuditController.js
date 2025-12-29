import Audit from "../../models/Audit.js";

// ============= GET ALL AUDIT LOGS (Admin Only) =============
/**
 * GET /api/admin/logs
 * Get all audit logs with filters and pagination
 * Query: ?page=1&limit=50&entityType=ORGANIZATION&action=APPROVED&performedBy=admin@sebn.com&dateFrom=2025-12-01&dateTo=2025-12-31
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      entityType, 
      action, 
      performedBy, 
      performedByRole, 
      status,
      dateFrom,
      dateTo 
    } = req.query;

    const filters = {
      ...(entityType && { entityType }),
      ...(action && { action }),
      ...(performedBy && { performedBy }),
      ...(performedByRole && { performedByRole }),
      ...(status && { status }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Audit.findAll(filters, pagination);

    return res.status(200).json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving audit logs",
      error: error.message
    });
  }
};

// ============= GET AUDIT LOG BY ID (Admin Only) =============
/**
 * GET /api/admin/logs/:logId
 * Get specific audit log by ID
 */
export const getAuditLogById = async (req, res) => {
  try {
    const { logId } = req.params;

    if (!logId) {
      return res.status(400).json({
        success: false,
        message: "Log ID is required"
      });
    }

    const log = await Audit.findById(logId);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit log retrieved successfully",
      data: log
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving audit log",
      error: error.message
    });
  }
};

// ============= GET LOGS BY ENTITY TYPE (Admin Only) =============
/**
 * GET /api/admin/logs/by-entity-type/:entityType
 * Get logs for a specific entity type
 * Entity Types: ORGANIZATION, EMERGENCY, BLOOD_STOCK, ALERT, HOSPITAL, BLOODBANK, NGO
 */
export const getLogsByEntityType = async (req, res) => {
  try {
    const { entityType } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const validEntityTypes = [
      "ORGANIZATION",
      "EMERGENCY",
      "BLOOD_STOCK",
      "ALERT",
      "HOSPITAL",
      "BLOODBANK",
      "NGO",
      "USER",
      "APPROVAL"
    ];

    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid entity type. Must be one of: ${validEntityTypes.join(", ")}`
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Audit.findByEntityType(entityType, pagination);

    return res.status(200).json({
      success: true,
      message: `Audit logs for ${entityType} retrieved successfully`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving logs by entity type",
      error: error.message
    });
  }
};

// ============= GET LOGS BY ACTION (Admin Only) =============
/**
 * GET /api/admin/logs/by-action/:action
 * Get logs for a specific action
 * Actions: CREATED, UPDATED, APPROVED, REJECTED, SUSPENDED, ACTIVATED, DELETED
 */
export const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const validActions = [
      "CREATED",
      "UPDATED",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
      "ACTIVATED",
      "DELETED",
      "ACCESSED",
      "LOGIN",
      "LOGOUT"
    ];

    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(", ")}`
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Audit.findByAction(action, pagination);

    return res.status(200).json({
      success: true,
      message: `Audit logs for action ${action} retrieved successfully`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving logs by action",
      error: error.message
    });
  }
};

// ============= GET LOGS BY ENTITY CODE (Admin Only) =============
/**
 * GET /api/admin/logs/by-entity-code/:entityCode
 * Get all logs for a specific entity (track all changes)
 * Example: HOSP-DEL-001, BB-MUM-001, EMG-2025-001
 */
export const getLogsByEntityCode = async (req, res) => {
  try {
    const { entityCode } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!entityCode) {
      return res.status(400).json({
        success: false,
        message: "Entity code is required"
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Audit.findByEntityCode(entityCode, pagination);

    return res.status(200).json({
      success: true,
      message: `Audit logs for entity ${entityCode} retrieved successfully`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving logs by entity code",
      error: error.message
    });
  }
};

// ============= GET AUDIT STATISTICS (Admin Only) =============
/**
 * GET /api/admin/logs/stats
 * Get audit statistics and dashboard data
 * Query: ?dateFrom=2025-12-01&dateTo=2025-12-31
 */
export const getAuditStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const stats = await Audit.getStats(dateFrom, dateTo);

    return res.status(200).json({
      success: true,
      message: "Audit statistics retrieved successfully",
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving audit statistics",
      error: error.message
    });
  }
};

// ============= GET RECENT ACTIVITY (Admin Only) =============
/**
 * GET /api/admin/logs/recent
 * Get recent activity (last N logs)
 * Query: ?limit=20
 */
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const logs = await Audit.getRecentActivity(parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Recent activity retrieved successfully",
      data: {
        logs,
        count: logs.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving recent activity",
      error: error.message
    });
  }
};

export default {
  getAuditLogs,
  getAuditLogById,
  getLogsByEntityType,
  getLogsByAction,
  getLogsByEntityCode,
  getAuditStats,
  getRecentActivity
};
