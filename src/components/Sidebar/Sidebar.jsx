import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        {/* Updated Update link with dynamic ID */}
        <NavLink to="/update" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Update Items</p>
        </NavLink>
        <NavLink to="/food-category" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Add food category</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
