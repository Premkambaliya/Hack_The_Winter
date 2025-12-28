import { getDB } from "../../config/db.js";
import { ObjectId } from "mongodb";

/**
 * BloodBank Model
 * Note: Blood banks are stored in 'organizations' collection with type: 'bloodbank'
 */
class BloodBank {
  constructor() {
    this.collectionName = "organizations";
    this.type = "bloodbank";
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collectionName);
  }

  // Base query for blood banks only
  getBloodBankQuery() {
    return { type: this.type };
  }

  // CREATE - Add new blood bank
  async create(bloodBankData) {
    const collection = this.getCollection();
    const newBloodBank = {
      type: this.type,
      organizationCode: bloodBankData.organizationCode,
      name: bloodBankData.name,
      address: bloodBankData.address,
      city: bloodBankData.city,
      state: bloodBankData.state,
      pinCode: bloodBankData.pinCode,
      contactPerson: bloodBankData.contactPerson,
      email: bloodBankData.email.toLowerCase(),
      phone: bloodBankData.phone,
      licenseNumber: bloodBankData.licenseNumber,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newBloodBank);
    return { _id: result.insertedId, ...newBloodBank };
  }

  // READ - Find by MongoDB ID
  async findById(id) {
    const collection = this.getCollection();
    try {
      return await collection.findOne({
        _id: new ObjectId(id),
        ...this.getBloodBankQuery()
      });
    } catch (error) {
      return null;
    }
  }

  // READ - Find by Blood Bank Code
  async findByCode(organizationCode) {
    const collection = this.getCollection();
    return await collection.findOne({
      organizationCode,
      ...this.getBloodBankQuery()
    });
  }

  // READ - Find all with pagination & filters
  async findAll(filters = {}, pagination = {}) {
    const collection = this.getCollection();
    const { page = 1, limit = 20 } = pagination;

    // Base query for blood banks only
    const query = { ...this.getBloodBankQuery() };
    
    // Add filters
    if (filters.status) query.status = filters.status;
    if (filters.city) query.city = new RegExp(filters.city, "i");
    if (filters.state) query.state = new RegExp(filters.state, "i");

    const total = await collection.countDocuments(query);
    const bloodBanks = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      bloodBanks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // READ - Find all by status
  async findByStatus(status, pagination = {}) {
    const collection = this.getCollection();
    const { page = 1, limit = 20 } = pagination;

    const query = {
      ...this.getBloodBankQuery(),
      status: status
    };

    const total = await collection.countDocuments(query);
    const bloodBanks = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      bloodBanks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // READ - Get blood stock for a blood bank
  async getBloodStock(id) {
    const collection = this.getCollection();
    try {
      const bloodBank = await collection.findOne({
        _id: new ObjectId(id),
        ...this.getBloodBankQuery()
      });

      if (!bloodBank) return null;

      // Return blood stock if available, otherwise return empty stock
      return {
        bloodBankId: bloodBank._id,
        organizationCode: bloodBank.organizationCode,
        name: bloodBank.name,
        bloodStock: bloodBank.bloodStock || {
          "O+": 0,
          "O-": 0,
          "A+": 0,
          "A-": 0,
          "B+": 0,
          "B-": 0,
          "AB+": 0,
          "AB-": 0
        }
      };
    } catch (error) {
      return null;
    }
  }

  // UPDATE - By ID
  async updateById(id, updateData) {
    const collection = this.getCollection();
    try {
      const result = await collection.updateOne(
        { 
          _id: new ObjectId(id),
          ...this.getBloodBankQuery()
        },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      return false;
    }
  }

  // UPDATE - Status
  async updateStatus(id, status) {
    return await this.updateById(id, { status });
  }

  // DELETE
  async deleteById(id) {
    const collection = this.getCollection();
    try {
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        ...this.getBloodBankQuery()
      });
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  }
}

export default new BloodBank();
