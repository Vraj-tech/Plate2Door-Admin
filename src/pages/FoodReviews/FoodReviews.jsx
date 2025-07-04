import React, { useEffect, useState } from "react";
import "./FoodReviews.css";
const BASE_URL = import.meta.env.VITE_API_URL;

const FoodReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/reviews/admin/food-ratings`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  return (
    <div className="food-reviews">
      <h2>Food Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Food</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.userId?.name || "N/A"}</td>
              {/* Fix: Get name from userId object */}
              <td>{review.foodId?.name || "N/A"}</td>
              {/* Fix: Get name from foodId object */}
              <td>{review.rating} ⭐</td>
              <td>
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodReviews;
