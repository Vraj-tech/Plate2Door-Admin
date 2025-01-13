import React, { useState, useEffect } from "react";
import { url, currency } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import "./Update.css";

const Update = () => {
  const [list, setList] = useState([]);
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

  // Fetch list of food items
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error fetching food list");
    }
  };

  // Fetch food details when update button is clicked
  const fetchFoodDetails = async (id) => {
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

  // Handle the update button click
  const handleUpdateClick = (id) => {
    setFoodId(id); // Set the foodId for the selected item
    fetchFoodDetails(id); // Fetch the food details
    setIsFormVisible(true); // Show the form
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
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="action-buttons">
              {/* Update Button */}
              <button onClick={() => handleUpdateClick(item._id)}>
                Update
              </button>
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
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                {/* Add more categories if needed */}
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
