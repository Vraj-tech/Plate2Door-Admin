import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBookmarks.css"; // ✅ Create this CSS file for styling
import { url } from "../../assets/assets";
import Loading from "../../components/Loading/Loading.jsx";

const AdminBookmarks = () => {
  const [bookmarkedFoods, setBookmarkedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkStats = async () => {
      try {
        const response = await axios.get(`${url}/api/user/bookmarks/stats`);
        if (response.data.success) {
          setBookmarkedFoods(response.data.data);
        } else {
          console.error("Failed to fetch bookmark stats");
        }
      } catch (error) {
        console.error("Error fetching bookmark stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkStats();
  }, []);

  return (
    <div className="admin-bookmarks">
      <h2>Most Bookmarked Foods</h2>

      {loading ? (
        <Loading /> // ✅ Use the Loading component here
      ) : bookmarkedFoods.length === 0 ? (
        <p className="no-bookmarks">No bookmarks found.</p>
      ) : (
        <table className="bookmarks-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Food Name</th>
              <th>Bookmarks</th>
            </tr>
          </thead>
          <tbody>
            {bookmarkedFoods.map((food, index) => (
              <tr key={food.id}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td>{food.bookmarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookmarks;
