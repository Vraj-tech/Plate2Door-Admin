import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, url, currency } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

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

  useEffect(() => {
    fetchAllOrders();
    fetchDeliveryPartners();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) =>
                  index === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>
                  {`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>

            <p>Items: {order.items.length}</p>
            <p>
              {currency}
              {order.amount}
            </p>

            {/* ✅ Order Status Dropdown */}
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
            </select>

            {/* ✅ Delivery Partner Assignment Dropdown */}
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
        ))}
      </div>
    </div>
  );
};

export default Order;
