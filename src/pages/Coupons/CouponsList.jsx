import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./CouponsList.css"; // Ensure this import is at the top of the file

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  // Fetch coupons from the backend when the component mounts
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/coupons/list"
      );
      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching coupons.");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle deleting a coupon
  const deleteCoupon = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/coupons/remove",
        { id }
      );

      if (response.data.success) {
        toast.success("Coupon deleted successfully! ✅");
        fetchCoupons(); // Refresh the coupon list after deletion
      } else {
        toast.error("Failed to delete coupon.");
      }
    } catch (error) {
      toast.error("Error deleting coupon.");
    }
  };

  return (
    <div className="coupons-list-container">
      <h2>Coupons List</h2>
      <button onClick={() => navigate("/add-coupon")}>Add Coupon</button>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Min Order</th>
            <th>Expiry Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountPercentage}%</td>
              <td>₹{coupon.minOrderAmount}</td>
              <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteCoupon(coupon._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsList;
