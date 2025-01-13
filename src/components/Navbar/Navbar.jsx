import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <div class="navbar">
      <div class="logo-container">
        <img src={assets.logo} alt="Logo" class="logo" />
      </div>
      <p class="admin-panel">Admin Panel</p>
      <img src={assets.profile_image} alt="Profile" class="profile" />
    </div>
  );
};

export default Navbar;
