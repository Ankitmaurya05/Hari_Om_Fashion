import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";

const API_URL = "https://hari-om-fashion.onrender.com/api/products";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [mainPreview, setMainPreview] = useState(null);
  const [subPreviews, setSubPreviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    fabric: "",
    careInstructions: "",
    sizes: [],
    colors: [],
    isTrending: false,
    mainImage: null,       // new file
    subImages: [],         // new files
    existingMain: null,    // URL string
    existingSubs: [],      // URL array
  });

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      console.log("Fetched products:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ---------------- HANDLE MAIN IMAGE ----------------
  const handleMainUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(prev => ({ ...prev, mainImage: file }));
    setMainPreview(URL.createObjectURL(file));
  };

  // ---------------- HANDLE SUB IMAGES ----------------
  const handleSubUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + subPreviews.length > 4) return alert("Max 4 sub-images allowed");
    setForm(prev => ({ ...prev, subImages: [...prev.subImages, ...files] }));
    setSubPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeSubImage = (index) => {
    setForm(prev => {
      const newFiles = [...prev.subImages];
      if (index >= prev.existingSubs.length) newFiles.splice(index - prev.existingSubs.length, 1);
      const newExisting = [...prev.existingSubs];
      if (index < prev.existingSubs.length) newExisting.splice(index, 1);
      return { ...prev, subImages: newFiles, existingSubs: newExisting };
    });
    setSubPreviews(prev => {
      const newPrev = [...prev];
      newPrev.splice(index, 1);
      return newPrev;
    });
  };

  // ---------------- RESET FORM ----------------
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      description: "",
      fabric: "",
      careInstructions: "",
      sizes: [],
      colors: [],
      isTrending: false,
      mainImage: null,
      subImages: [],
      existingMain: null,
      existingSubs: [],
    });
    setMainPreview(null);
    setSubPreviews([]);
    setEditingId(null);
  };

  // ---------------- EDIT PRODUCT ----------------
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || "",
      category: product.category,
      description: product.description,
      fabric: product.fabric || "",
      careInstructions: product.careInstructions || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      isTrending: product.isTrending || false,
      mainImage: null,
      subImages: [],
      existingMain: product.mainImage,
      existingSubs: product.images?.filter(img => img !== product.mainImage) || [],
    });
    setMainPreview(product.mainImage);
    setSubPreviews(product.images?.filter(img => img !== product.mainImage) || []);
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      console.log("Deleted product:", id);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mainImage && !form.existingMain) return alert("Main image is required!");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      if (form.originalPrice) formData.append("originalPrice", form.originalPrice);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.fabric) formData.append("fabric", form.fabric);
      if (form.careInstructions) formData.append("careInstructions", form.careInstructions);
      form.sizes.forEach(s => formData.append("sizes", s));
      form.colors.forEach(c => formData.append("colors", c));
      formData.append("isTrending", form.isTrending);

      // Main image
      if (form.mainImage) formData.append("images", form.mainImage);
      else formData.append("existingMain", form.existingMain);

      // Sub images
      form.subImages.forEach(f => formData.append("images", f));
      form.existingSubs.forEach(url => formData.append("existingSubs", url));

      console.log("Submitting formData...");

      const res = editingId
        ? await axios.put(`${API_URL}/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        : await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });

      console.log("Submit response:", res.data);
      alert(editingId ? "Product updated!" : "Product added!");
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">🛍️ Product Management</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto mb-10">
        {/* Fields omitted for brevity: name, price, category, sizes, colors, description */}
        {/* MAIN IMAGE */}
        <div className="mb-4">
          <p className="font-medium">Main Image</p>
          {mainPreview && <img src={mainPreview} alt="main" className="w-32 h-32 object-cover my-2 rounded" />}
          <label className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded">
            Upload Main Image
            <input type="file" accept="image/*" hidden onChange={handleMainUpload} />
          </label>
        </div>

        {/* SUB IMAGES */}
        <div className="mb-4">
          <p className="font-medium">Sub Images (max 4)</p>
          <div className="flex gap-2 flex-wrap mb-2">
            {subPreviews.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`sub-${i}`} className="w-24 h-24 object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => removeSubImage(i)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded">
            Upload Sub Images
            <input type="file" accept="image/*" multiple hidden onChange={handleSubUpload} />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-700 text-white px-4 py-2 rounded mt-4 flex items-center gap-2"
        >
          {submitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* PRODUCT GRID */}
      {loading ? <p className="text-center">Loading products...</p> :
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow relative">
              <img src={p.mainImage || p.images?.[0]} alt={p.name} className="w-full h-48 object-cover rounded mb-2" />
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-500">{p.category}</p>
              <p className="text-blue-700 font-bold">₹{p.price}</p>
              <div className="flex justify-between mt-2">
                <button onClick={() => handleEdit(p)} className="text-yellow-500 flex items-center gap-1"><Pencil size={16} />Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 flex items-center gap-1"><Trash2 size={16} />Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default AdminProducts;
