import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove the token
    navigate("/admin/login"); // Redirect to the login page
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={assets.logo} alt="Logo" className="logo" />
      </div>
      <p className="admin-panel">Admin Panel</p>

      {/* Profile Image and Logout */}
      <div
        className="profile-container"
        onMouseEnter={() => setShowLogout(true)}
        onMouseLeave={() => setShowLogout(false)}
      >
        <img src={assets.profile_image} alt="Profile" className="profile" />

        {showLogout && (
          <div className="logout-dropdown">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
