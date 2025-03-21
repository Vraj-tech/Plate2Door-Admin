import { useEffect, useState } from "react";
import "./DeliveryPartners.css";
import Loading from "../../components/Loading/Loading.jsx";

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Delivery Partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/delivery/pending"
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setPartners(data.pendingPartners);
        setError(""); // Clear previous errors if successful
      } else {
        setError(data.message || "Failed to fetch partners.");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // ✅ Approve or Reject Partner and Update State Locally
  const updateStatus = async (partnerId, status) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/delivery/status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partnerId, status }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        // ✅ Directly update the partners state
        setPartners((prevPartners) =>
          prevPartners.filter((partner) => partner._id !== partnerId)
        );
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="delivery-partners-container">
      <h2>Delivery Partners Management</h2>

      {loading ? (
        <Loading /> // ✅ Use the Loading component here
      ) : error ? (
        <p className="error">{error}</p>
      ) : partners.length === 0 ? (
        <p>No pending partners found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner._id}>
                <td>{partner.name}</td>
                <td>{partner.email}</td>
                <td>{partner.phone}</td>
                <td>
                  <span className={`status ${partner.status}`}>
                    {partner.status}
                  </span>
                </td>
                <td>
                  {partner.status === "pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => updateStatus(partner._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => updateStatus(partner._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryPartners;
