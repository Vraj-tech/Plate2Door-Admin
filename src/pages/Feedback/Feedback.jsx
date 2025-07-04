import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";
import Loading from "../../components/Loading/Loading.jsx";
const BASE_URL = import.meta.env.VITE_API_URL;

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [selectedRating, setSelectedRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedRating, searchQuery, feedbackList]);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Unauthorized: Please log in as Admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/feedback/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbackList(response.data);
      setFilteredFeedback(response.data);
    } catch (error) {
      setError("Failed to fetch feedback. Please try again.");
      setFeedbackList([]);
      setFilteredFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete feedback
  const deleteFeedback = async (feedbackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${BASE_URL}/api/feedback/delete/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted feedback from UI
      setFeedbackList(feedbackList.filter((item) => item._id !== feedbackId));
      setFilteredFeedback(
        filteredFeedback.filter((item) => item._id !== feedbackId)
      );
      alert("Feedback deleted successfully!");
    } catch (error) {
      alert("Failed to delete feedback. Try again.");
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbackList];

    if (selectedRating) {
      filtered = filtered.filter(
        (feedback) => feedback.rating === Number(selectedRating)
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((feedback) =>
        feedback.user_id?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFeedback(filtered);
  };

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>

      {/* 🔽 Filter Options */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="1">1 ⭐</option>
        </select>
      </div>

      {loading ? (
        <Loading /> // ✅ Use the Loading component here
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredFeedback.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Selected Options</th>
              <th>Feedback</th>
              <th>Date</th>
              <th>Action</th> {/* Add a new column for delete button */}
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.map((feedback) => (
              <tr key={feedback._id}>
                <td>{feedback.user_id?.name || "Unknown User"}</td>
                <td>{feedback.rating} ⭐</td>
                <td>{feedback.selected_options?.join(", ") || "N/A"}</td>
                <td>{feedback.feedback_text || "No feedback provided"}</td>
                <td>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(feedback.createdAt))}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteFeedback(feedback._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="white"
                    >
                      <path d="M9 3V4H4V6H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V6H20V4H15V3H9M7 6H17V19C17 19.55 16.55 20 16 20H8C7.45 20 7 19.55 7 19V6M9 8V18H11V8H9M13 8V18H15V8H13Z" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Feedback;
