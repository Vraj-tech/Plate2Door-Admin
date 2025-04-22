import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import {
  Bookmark,
  Feedback,
  LocalShipping,
  RateReview,
  AddCircleOutline,
  ListAlt,
  Edit,
  Category,
  LocalOffer,
  Inventory2, // ✅ New Icon for Orders
} from "@mui/icons-material"; // ✅ Import Feedback Icon

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/food-category" className="sidebar-option">
          <Category style={{ color: "green", fontSize: "24px" }} />
          <p>Add/Delete Food Category</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <Inventory2 style={{ color: "red", fontSize: "24px" }} />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <AddCircleOutline style={{ color: "blue", fontSize: "24px" }} />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <ListAlt style={{ color: "brown", fontSize: "24px" }} />
          <p>List/Delete Items</p>
        </NavLink>

        <NavLink to="/update" className="sidebar-option">
          <Edit style={{ color: "orange", fontSize: "24px" }} />
          <p>Update Items</p>
        </NavLink>

        <NavLink to="/coupons" className="sidebar-option">
          <LocalOffer style={{ color: "purple", fontSize: "24px" }} />
          <p>Manage Coupons</p>
        </NavLink>

        {/* ✅ Improved "Bookmarked Foods" Section */}
        <NavLink to="/admin/bookmarks" className="sidebar-option">
          <Bookmark style={{ color: "orange", fontSize: "24px" }} />{" "}
          {/* ✅ Using Material-UI Icon */}
          <p>Bookmarked Foods</p>
        </NavLink>
        {/* ✅ "User Feedback" Section */}
        <NavLink to="/feedback" className="sidebar-option">
          <Feedback style={{ color: "#1976d2", fontSize: "24px" }} />{" "}
          {/* ✅ Blue Color */}
          <p>User Feedback</p>
        </NavLink>
        {/* ✅ Delivery Partners */}
        <NavLink to="/admin/delivery-partners" className="sidebar-option">
          <LocalShipping style={{ color: "green", fontSize: "24px" }} />
          <p>Delivery Partners</p>
        </NavLink>
        {/* ✅ Food Reviews (Fixed Link) */}
        <NavLink to="/admin/food-reviews" className="sidebar-option">
          <RateReview style={{ color: "purple", fontSize: "24px" }} />
          <p>Food Reviews</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

{
  /* <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink> */
}
