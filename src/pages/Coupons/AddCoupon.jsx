import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddCoupon.css"; // Ensure this import is at the top of the file
const BASE_URL = import.meta.env.VITE_API_URL;

const AddCoupon = () => {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/coupons/add`, {
        code,
        discountPercentage,
        minOrderAmount,
        expiryDate,
        usageLimit,
      });

      if (response.data.success) {
        toast.success("Coupon added successfully! 🎉");

        // Reset the form after successful submission
        setCode("");
        setDiscountPercentage("");
        setMinOrderAmount("");
        setExpiryDate("");
        setUsageLimit("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add coupon. Please try again.");
    }
  };

  return (
    <div className="add-coupon-container">
      <h3>Add New Coupon</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Discount Percentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Min Order Amount"
          value={minOrderAmount}
          onChange={(e) => setMinOrderAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Usage Limit"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
          required
        />
        <button type="submit">Add Coupon</button>
      </form>
    </div>
  );
};

export default AddCoupon;
