import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, url, currency } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    outForDelivery: 0,
    deliveredOrders: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8; // Show 10 orders per page

  // ✅ Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      toast.error("Server Error while fetching orders.");
    }
  };

  // ✅ Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await axios.get(`${url}/api/order/order-stats`);
      if (response.data.success) {
        setOrderStats(response.data.data);
      } else {
        toast.error("Failed to fetch order statistics.");
      }
    } catch (error) {
      toast.error("Server Error while fetching order statistics.");
    }
  };

  // ✅ Fetch available delivery partners
  const fetchDeliveryPartners = async () => {
    try {
      const response = await axios.get(`${url}/api/delivery/list`);
      if (response.data.success) {
        // Filter only available partners
        const availablePartners = response.data.partners.filter(
          (partner) => partner.isAvailable
        );
        setDeliveryPartners(availablePartners);
      } else {
        toast.error("Failed to fetch delivery partners.");
      }
    } catch (error) {
      toast.error("Server Error while fetching delivery partners.");
    }
  };

  // ✅ Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        await fetchOrderStats(); // Refresh stats when status changes
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Server Error while updating status.");
    }
  };

  // ✅ Assign a delivery partner to an order
  const assignDeliveryPartner = async (event, orderId) => {
    const deliveryPartnerId = event.target.value;
    if (!deliveryPartnerId) return;

    try {
      const response = await axios.post(`${url}/api/delivery/assign-delivery`, {
        orderId,
        deliveryPartnerId,
      });

      if (response.data.success) {
        toast.success("Delivery partner assigned successfully.");
        await fetchAllOrders();
      } else {
        toast.error("Failed to assign delivery partner.");
      }
    } catch (error) {
      toast.error("Server Error while assigning delivery partner.");
    }
  };

  // ✅ Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // ✅ Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchAllOrders();
    fetchDeliveryPartners();
    fetchOrderStats(); // Fetch statistics on page load
  }, []);

  return (
    <div className="order add">
      <h3>📦 Order Management</h3>

      {/* ✅ Order Statistics Section */}
      <div className="order-stats">
        <div className="stat-box total">
          <h3>Total Orders</h3>
          <p>{orderStats.totalOrders}</p>
        </div>
        <div className="stat-box pending">
          <h3>Pending Orders</h3>
          <p>{orderStats.pendingOrders}</p>
        </div>
        <div className="stat-box out-for-delivery">
          <h3>Out for Delivery</h3>
          <p>{orderStats.outForDelivery}</p>
        </div>
        <div className="stat-box delivered">
          <h3>Delivered Orders</h3>
          <p>{orderStats.deliveredOrders}</p>
        </div>
      </div>

      {/* ✅ Order List with Pagination */}
      <div className="order-list">
        {currentOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          currentOrders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items
                    .map(
                      (item, i) =>
                        `${item.name} x ${item.quantity}${
                          i !== order.items.length - 1 ? ", " : ""
                        }`
                    )
                    .join("")}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>
                {currency}
                {order.amount}
              </p>

              {/* ✅ Status Dropdown */}
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

              {/* ✅ Delivery Partner Assignment */}
              <select
                onChange={(e) => assignDeliveryPartner(e, order._id)}
                value={order.deliveryPartner?._id || ""}
              >
                <option value="">Assign Available Partner</option>
                {deliveryPartners.length > 0 ? (
                  deliveryPartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} ({partner.phone})
                    </option>
                  ))
                ) : (
                  <option disabled>No Available Partners</option>
                )}
              </select>
            </div>
          ))
        )}
      </div>

      {/* ✅ Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Order;
