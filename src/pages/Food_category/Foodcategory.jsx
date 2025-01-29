import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Foodcategory.css";

const FoodCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/categories/list"
      );
      if (response.data.success) {
        setCategories(response.data.data); // Set categories
      }
    } catch (error) {
      setMessage("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryImage) {
      setMessage("Please provide a category name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", categoryImage);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/categories/add",
        formData
      );
      if (response.data.success) {
        setMessage("Category added successfully!");
        setCategoryName("");
        setCategoryImage(null);
        setPreviewImage(null);
        fetchCategories(); // Refresh category list
      }
    } catch (error) {
      setMessage("Failed to add category. Please try again.");
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deleteCategoryName) {
      setDeleteMessage("Please provide a category name to delete.");
      return;
    }

    const category = categories.find((cat) => cat.name === deleteCategoryName);

    if (!category) {
      setDeleteMessage("Category not found.");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:4000/api/categories/remove",
        { data: { id: category._id } } // Send the category ID for deletion
      );
      if (response.data.success) {
        setDeleteMessage("Category and associated foods deleted successfully!");
        setDeleteCategoryName("");
        fetchCategories(); // Refresh category list
      }
    } catch (error) {
      setDeleteMessage("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="food-category-wrapper">
      <div className="food-category-container">
        <h2>Add Food Category</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleAddSubmit} className="food-category-form">
          <label>Category Name:</label>
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="preview-img" />
          )}

          <button type="submit">Add Category</button>
        </form>
      </div>

      <div className="food-category-container">
        <h2>Delete Food Category</h2>
        {deleteMessage && <p className="message">{deleteMessage}</p>}
        <form onSubmit={handleDeleteSubmit} className="food-category-form">
          <label>Category Name:</label>
          <select
            value={deleteCategoryName}
            onChange={(e) => setDeleteCategoryName(e.target.value)}
          >
            <option value="">Select category to delete</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="delete-button">
            Delete Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodCategory;
