import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Update from "./pages/Update/Update";
import FoodCategory from "./pages/Food_category/Foodcategory";
import CouponsList from "./pages/Coupons/CouponsList";
import AddCoupon from "./pages/Coupons/AddCoupon";
import Orders from "./pages/Orders/Orders";
import AdminLogin from "./pages/auth/AdminLogin"; // Import Admin Login Page
import AdminBookmarks from "./pages/Bookmarks/AdminBookmarks";
import Feedback from "./pages/Feedback/Feedback";
import DeliveryPartners from "./pages/DeliveryPartners/DeliveryPartners"; // ✅ Import Delivery Partners Page

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken"); // Check if logged in
  return token ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const location = useLocation();

  // State to track admin login status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  useEffect(() => {
    // Update state when localStorage changes
    const checkLogin = () =>
      setIsAdminLoggedIn(!!localStorage.getItem("adminToken"));

    window.addEventListener("storage", checkLogin); // Listen for localStorage changes

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // Redirect to login if not logged in and on the main page
  if (!isAdminLoggedIn && location.pathname === "/") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="app">
      <ToastContainer />

      {/* 🔥 Hide Navbar & Sidebar when on login page 🔥 */}
      {isAdminLoggedIn && location.pathname !== "/admin/login" && <Navbar />}
      <hr />
      <div
        className={`app-content ${
          location.pathname === "/admin/login" ? "full-screen-login" : ""
        }`}
      >
        {isAdminLoggedIn && location.pathname !== "/admin/login" && <Sidebar />}

        <Routes>
          {/* Redirect "/" to "/admin/login" if not logged in */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          {/* Admin Login Route (🔥 Full-screen when logged out) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Protected Admin Routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Add />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <List />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update"
            element={
              <ProtectedRoute>
                <Update />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-category"
            element={
              <ProtectedRoute>
                <FoodCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coupons"
            element={
              <ProtectedRoute>
                <CouponsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-coupon"
            element={
              <ProtectedRoute>
                <AddCoupon />
              </ProtectedRoute>
            }
          />
          {/* ✅ New Route: Admin Bookmarked Foods */}
          <Route
            path="/admin/bookmarks"
            element={
              <ProtectedRoute>
                <AdminBookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />
          {/* ✅ New Delivery Partners Route */}
          <Route
            path="/admin/delivery-partners"
            element={
              <ProtectedRoute>
                <DeliveryPartners />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
