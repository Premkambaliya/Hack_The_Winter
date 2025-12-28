// import { useState } from "react";
// import { loginUser } from "../services/authApi";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser({ email, password });
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.role);

//       alert("Login successful");

//       // 🔀 Role-based redirect
//       if (res.data.role === "admin") window.location.href = "/admin";
//       else if (res.data.role === "ngo") window.location.href = "/ngo";
//       else if (res.data.role === "bloodbank") window.location.href = "/bloodbank";
//       else if (res.data.role === "hospital") window.location.href = "/hospital";
//       else window.location.href = "/user";

//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit}>
//         <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//         <input
//           placeholder="Password"
//           type="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { loginUser } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      // Backend returns: { success, message, token, user: { role, email, name, ... } }
      const { token, user } = res.data;

      // 🔴 ROLE CHECK
      if (user.role !== role) {
        toast.error("Role mismatch! Please select correct role.");
        setLoading(false);
        return;
      }

      // ✅ SAVE AUTH DATA using AuthContext
      login(user, token);

      toast.success("Login successful! Redirecting...");

      // 🔀 ROLE-BASED REDIRECT
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "ngo") navigate("/ngo");
      else if (user.role === "bloodbank") navigate("/bloodbank");
      else if (user.role === "hospital") navigate("/hospital");
      else navigate("/user");

    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-700">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
          />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
          />

          {/* ✅ ROLE SELECT */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            <option value="user">User</option>
            <option value="ngo">NGO</option>
            <option value="bloodbank">Blood Bank</option>
            <option value="hospital">Hospital</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 text-white py-3 rounded-md font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-slate-700 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
