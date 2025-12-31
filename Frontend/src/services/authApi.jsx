import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

export const registerUser = (data) => API.post("/register", data);

export const loginUser = (data) => {
  console.log("🔑 [LOGIN_REQUEST] Sending login data to backend:", data);
  console.log("   - organizationCode:", data.organizationCode);
  console.log("   - email:", data.email);
  console.log("   - password:", data.password ? "[PASSWORD_HIDDEN]" : "[NO_PASSWORD]");
  
  return API.post("/login", data).then((response) => {
    console.log("✅ [LOGIN_RESPONSE] Received response from backend:", response.data);
    if (response.data.user) {
      console.log("   - User Code:", response.data.user.userCode);
      console.log("   - Role:", response.data.user.role);
      console.log("   - Organization Type:", response.data.user.organizationType);
      console.log("   - Email:", response.data.user.email);
      console.log("   - Token:", response.data.token ? "[TOKEN_RECEIVED]" : "[NO_TOKEN]");
    }
    return response;
  }).catch((error) => {
    console.error("❌ [LOGIN_ERROR] Login failed:", error.response?.data || error.message);
    console.error("   - Status:", error.response?.status);
    console.error("   - Error Message:", error.response?.data?.message);
    throw error;
  });
};
