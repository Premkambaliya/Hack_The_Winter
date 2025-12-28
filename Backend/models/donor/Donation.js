import { getDB } from "../../config/db.js";

export const DonationCollection = () => {
  return getDB().collection("donations");
};
