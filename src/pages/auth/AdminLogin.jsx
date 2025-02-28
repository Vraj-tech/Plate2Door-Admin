import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" }); // Added 'name' field
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    // Password validation (min 8 characters)
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    //ahi thi
    const BASE_URL = "http://localhost:4000"; // Your backend server URL
    const endpoint = isRegister
      ? `${BASE_URL}/api/admin/register`
      : `${BASE_URL}/api/admin/login`;

    //ahi badlyu

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success(
          isRegister ? "Registration Successful" : "Login Successful"
        );
        navigate("/add"); // Redirect to add items page instead of /admin/dashboard
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>{isRegister ? "Admin Register" : "Admin Login"}</h2>

        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Admin Name"
            value={data.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isRegister ? "Register" : "Login"}
        </button>

        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Login"
            : "New Admin? Register"}
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
