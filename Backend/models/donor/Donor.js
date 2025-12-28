import { getDB } from "../../config/db.js";

export const DonorCollection = () => {
  return getDB().collection("donors");
};
