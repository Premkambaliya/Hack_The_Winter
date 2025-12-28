import BloodBank from "../../models/admin/BloodBank.js";

// ============= GET ALL BLOOD BANKS =============
/**
 * GET /admin/bloodbanks
 * Query: ?status=APPROVED&city=Mumbai&page=1&limit=20
 */
export const getAllBloodBanks = async (req, res) => {
  try {
    const { status, city, state, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (city) filters.city = city;
    if (state) filters.state = state;

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await BloodBank.findAll(filters, pagination);

    return res.status(200).json({
      success: true,
      message: "Blood banks retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blood banks",
      error: error.message
    });
  }
};

// ============= GET BLOOD BANK BY ID =============
/**
 * GET /admin/bloodbanks/id/:bloodBankId
 * Params: bloodBankId (MongoDB ObjectId)
 */
export const getBloodBankById = async (req, res) => {
  try {
    const { bloodBankId } = req.params;

    if (!bloodBankId) {
      return res.status(400).json({
        success: false,
        message: "Blood bank ID is required"
      });
    }

    const bloodBank = await BloodBank.findById(bloodBankId);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood bank retrieved successfully",
      data: bloodBank
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blood bank",
      error: error.message
    });
  }
};

// ============= GET BLOOD BANK BY CODE =============
/**
 * GET /admin/bloodbanks/code/:organizationCode
 * Params: organizationCode (string like BB-MUM-001)
 */
export const getBloodBankByCode = async (req, res) => {
  try {
    const { organizationCode } = req.params;

    if (!organizationCode) {
      return res.status(400).json({
        success: false,
        message: "Organization code is required"
      });
    }

    const bloodBank = await BloodBank.findByCode(organizationCode);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood bank retrieved successfully",
      data: bloodBank
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blood bank",
      error: error.message
    });
  }
};

// ============= GET BLOOD BANK STOCK =============
/**
 * GET /admin/bloodbanks/:bloodBankId/stock
 * Get blood stock for a specific blood bank (read-only)
 */
export const getBloodBankStock = async (req, res) => {
  try {
    const { bloodBankId } = req.params;

    if (!bloodBankId) {
      return res.status(400).json({
        success: false,
        message: "Blood bank ID is required"
      });
    }

    const bloodStock = await BloodBank.getBloodStock(bloodBankId);

    if (!bloodStock) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood stock retrieved successfully",
      data: bloodStock
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blood stock",
      error: error.message
    });
  }
};

// ============= GET BLOOD BANKS BY STATUS =============
/**
 * GET /admin/bloodbanks/status/:status
 * Get blood banks filtered by status (APPROVED, PENDING, REJECTED, SUSPENDED)
 * Query: ?page=1&limit=20
 */
export const getBloodBanksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    // Validate status
    const validStatuses = ["APPROVED", "PENDING", "REJECTED", "SUSPENDED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await BloodBank.findByStatus(status.toUpperCase(), pagination);

    return res.status(200).json({
      success: true,
      message: `Blood banks with status ${status} retrieved successfully`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blood banks",
      error: error.message
    });
  }
};

// ============= ACTIVATE BLOOD BANK =============
/**
 * POST /admin/bloodbanks/:id/activate
 * Change status from SUSPENDED to APPROVED
 */
export const activateBloodBank = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blood bank ID is required"
      });
    }

    const success = await BloodBank.updateStatus(id, "APPROVED");

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found or already active"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood bank activated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error activating blood bank",
      error: error.message
    });
  }
};

// ============= SUSPEND BLOOD BANK =============
/**
 * POST /admin/bloodbanks/:id/suspend
 * Change status to SUSPENDED with optional reason
 */
export const suspendBloodBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blood bank ID is required"
      });
    }

    const updateData = { status: "SUSPENDED" };
    if (reason) updateData.suspensionReason = reason;

    const success = await BloodBank.updateById(id, updateData);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blood bank suspended successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error suspending blood bank",
      error: error.message
    });
  }
};

export default {
  getAllBloodBanks,
  getBloodBankById,
  getBloodBankByCode,
  getBloodBankStock,
  getBloodBanksByStatus,
  activateBloodBank,
  suspendBloodBank
};
