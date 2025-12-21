import Modal from "./Modal";
import { useState, useEffect } from "react";
import { Upload, X, Tag, ArrowRightLeft } from "lucide-react";
import Select from "../../../components/Select";

export default function EditProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading = false,
}) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
    type: "selling", // 'selling' or 'buying'
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price:
          product.price?.toString().replace("$", "").replace("₱", "") || "",
        category: product.category || "",
        stock: product.stock?.toString() || "",
        image: product.image || "",
        description: product.description || "",
        type: product.type || "selling",
      });
      setImagePreview(product.image || null);
    } else {
      // Reset form for adding new product
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        description: "",
        type: "selling",
      });
      setImagePreview(null);
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Image size must be less than 5MB");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData,
      price: formData.price, // Pass raw value, Products.jsx will parseFloat
      stock: formData.stock, // Pass raw value, Products.jsx will parseInt
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        {/* Type Selection */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column - Image Upload */}
          <div className="w-full md:w-5/12">
            <div className="h-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm group bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/10 transition-colors bg-gray-50">
                  <Upload size={48} className="text-gray-300 mb-4" />
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Supported: JPG, PNG, GIF
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Max size: 5MB</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="w-full md:w-7/12 space-y-5">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "selling" }))
                }
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === "selling"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                <Tag size={20} strokeWidth={2.5} className="mb-1" />
                <span className="font-bold text-xs">I'm Selling</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "buying" }))
                }
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === "buying"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowRightLeft size={20} strokeWidth={2.5} className="mb-1" />
                <span className="font-bold text-xs">I'm Buying</span>
              </button>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category *
                </label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  containerClassName="w-full"
                  className="w-full focus:border-indigo-600 focus:ring-indigo-600"
                >
                  <option value="">Select</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                placeholder="0"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors resize-none"
                placeholder="Product description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
              ? "Save Changes"
              : "Add Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
