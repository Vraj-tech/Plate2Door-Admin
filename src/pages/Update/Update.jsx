import React, { useState, useEffect } from "react";
import { url, currency } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import "./Update.css";

const Update = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    currentImage: "",
  });
  const [foodId, setFoodId] = useState(""); // Store the selected foodId
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [searchQuery, setSearchQuery] = useState(""); // For storing search query
  const [sortCriteria, setSortCriteria] = useState(""); // Store the selected sort criteria
  const [categories, setCategories] = useState([]); // Categories state

  // Fetch list of food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data); // Initially show all items
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Error fetching food list");
    }
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories/list`);
      if (response.data.success) {
        const dynamicCategories = response.data.data.map(
          (category) => category.name
        );
        setCategories(dynamicCategories); // Set dynamic categories
      } else {
        toast.error("Error fetching categories");
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  // Fetch food details when update button is clicked
  const fetchFoodDetails = async (id) => {
    setFoodId(id); // Set the foodId before showing the form
    setIsFormVisible(true); // Show the form when a food item is selected for update

    try {
      const response = await axios.get(`${url}/api/food/${id}`);
      if (response.data.success) {
        const { name, description, price, category, image } =
          response.data.data;
        setFormData({
          name,
          description,
          price,
          category,
          image: null, // for new image
          currentImage: image, // existing image
        });
        setPreviewImage(null); // Clear the preview
      } else {
        toast.error("Failed to fetch food details");
      }
    } catch (error) {
      toast.error("Error fetching food details");
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(file ? URL.createObjectURL(file) : null); // Set preview
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateFormData = new FormData();
    updateFormData.append("name", formData.name);
    updateFormData.append("description", formData.description);
    updateFormData.append("price", formData.price);
    updateFormData.append("category", formData.category);
    if (formData.image) {
      updateFormData.append("image", formData.image);
    }

    try {
      const response = await axios.put(
        `${url}/api/food/update/${foodId}`,
        updateFormData
      );
      if (response.data.success) {
        toast.success("Food updated successfully!");
        setIsFormVisible(false); // Hide the form after successful update
        fetchList(); // Refresh the list
      } else {
        toast.error("Failed to update food");
      }
    } catch (error) {
      toast.error("Error updating food");
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  useEffect(() => {
    // Filter based on search query
    let filtered = list.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // Sort based on selected sort criteria
    if (sortCriteria) {
      if (sortCriteria === "name-asc") {
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortCriteria === "name-desc") {
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortCriteria === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortCriteria === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      } else if (sortCriteria === "category") {
        filtered = filtered.sort((a, b) =>
          a.category.localeCompare(b.category)
        );
      }
    }

    // Set filtered list
    setFilteredList(filtered);
  }, [searchQuery, sortCriteria, list]); // This effect runs whenever searchQuery, sortCriteria or list changes

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search food or category to Update..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="sort-container">
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
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
        {filteredList.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="action-buttons">
              <button onClick={() => fetchFoodDetails(item._id)}>Update</button>
            </div>
          </div>
        ))}
      </div>

      {/* Show form only when isFormVisible is true */}
      {isFormVisible && (
        <div className="update-form">
          <h2>Update Food</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Category:
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Image:
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
            <div className="image-preview-container">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="New Preview"
                  className="preview-image"
                />
              )}
              {formData.currentImage && !previewImage && (
                <img
                  src={`${url}/images/${formData.currentImage}`}
                  alt="Current"
                  className="current-image"
                />
              )}
            </div>
            <button type="submit">Update Food</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Update;
