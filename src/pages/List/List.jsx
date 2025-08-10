import React, { useEffect, useState } from "react";
import "./List.css";
import { url, currency } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const List = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(""); // For sorting selection
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Fetch food list
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
      setFilteredList(response.data.data); // Initially show all items
    } else {
      toast.error("Error");
    }
  };

  // Remove food item
  // Remove food item
  const removeFood = async (foodId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this food item? This will also delete the image."
      )
    ) {
      return;
    }

    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh after deletion
      } else {
        toast.error(response.data.message || "Error deleting food");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while deleting food");
    }
  };

  // Handle search functionality
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) // Check category as well
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(list); // Show all items if no search query
    }
  };

  // Handle sorting
  const handleSort = (event) => {
    const option = event.target.value;
    setSortOption(option);

    let sortedList = [...filteredList];
    switch (option) {
      case "name-asc":
        sortedList.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
        break;
      case "name-desc":
        sortedList.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
        break;
      case "price-low":
        sortedList.sort((a, b) => a.price - b.price); // Low to High
        break;
      case "price-high":
        sortedList.sort((a, b) => b.price - a.price); // High to Low
        break;
      case "category":
        sortedList.sort((a, b) => a.category.localeCompare(b.category)); // Category-wise
        break;
      default:
        sortedList = list;
    }

    setFilteredList(sortedList);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination function to change the page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      {/* <p>All Foods List</p> */}

      {/* Display total number of foods */}
      <div className="food-count">
        <p> Total Food Items: {list.length}</p> {/* Display total items */}
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search food items"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="sort-container">
        <select value={sortOption} onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="name-asc">Alphabetical (A-Z)</option>
          <option value="name-desc">Alphabetical (Z-A)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Food Items */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {currentItems.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={item.image} alt={item.name} />

            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p className="cursor" onClick={() => removeFood(item._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredList.length / itemsPerPage) },
          (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default List;
