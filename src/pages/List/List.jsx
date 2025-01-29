import React, { useEffect, useState } from "react";
import "./List.css";
import { url, currency, assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const List = () => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [sortOption, setSortOption] = useState(""); // For sorting selection

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
      setFilteredList(response.data.data); // Initially, show all items
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId,
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

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

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {filteredList.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
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
          );
        })}
      </div>
    </div>
  );
};

export default List;
