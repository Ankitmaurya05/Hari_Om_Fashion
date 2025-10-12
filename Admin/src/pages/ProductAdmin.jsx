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
    mainImage: null,
    subImages: [],
  });

  // -------------------- Fetch Products --------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Fetch Error:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleMainUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, mainImage: file }));
    setMainPreview(URL.createObjectURL(file));
  };

  const handleSubUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + subPreviews.length > 5) return alert("Max 5 images allowed!");
    setForm((prev) => ({ ...prev, subImages: [...prev.subImages, ...files] }));
    setSubPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeSubImage = (index) => {
    setForm((prev) => {
      const newSub = [...prev.subImages];
      newSub.splice(index, 1);
      return { ...prev, subImages: newSub };
    });
    setSubPreviews((prev) => {
      const newPrev = [...prev];
      newPrev.splice(index, 1);
      return newPrev;
    });
  };

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
    });
    setMainPreview(null);
    setSubPreviews([]);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...product,
      sizes: product.sizes || [],
      colors: product.colors || [],
      mainImage: null,
      subImages: [],
    });
    setMainPreview(product.mainImage);
    setSubPreviews(product.images?.filter((img) => img !== product.mainImage) || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("❌ Delete Error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Delete failed!");
    }
  };

  // -------------------- Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and Price are required!");

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
      form.sizes.forEach((s) => formData.append("sizes", s));
      form.colors.forEach((c) => formData.append("colors", c));
      formData.append("isTrending", form.isTrending);

      // Append images
      if (form.mainImage) formData.append("images", form.mainImage);
      form.subImages.forEach((f) => formData.append("images", f));

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product updated!");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product added!");
      }

      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("❌ Submit Error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">🛍️ Product Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="border p-3 rounded-lg" required />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-3 rounded-lg" required />
          <input type="number" name="originalPrice" placeholder="Original Price" value={form.originalPrice} onChange={handleChange} className="border p-3 rounded-lg" />
          <select name="category" value={form.category} onChange={handleChange} className="border p-3 rounded-lg" required>
            <option value="">Select Category</option>
            <option value="jeans">Jeans</option>
            <option value="kurtis">Kurtis</option>
            <option value="gowns">Gowns</option>
            <option value="lehenga">Lehenga</option>
            <option value="salwar">Salwar</option>
          </select>

          <input type="text" name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} className="border p-3 rounded-lg" />
          <input type="text" name="careInstructions" placeholder="Care Instructions" value={form.careInstructions} onChange={handleChange} className="border p-3 rounded-lg" />

          <input
            type="text"
            name="colors"
            placeholder="Colors (comma separated)"
            value={form.colors.join(",")}
            onChange={(e) => setForm((prev) => ({ ...prev, colors: e.target.value.split(",").map((c) => c.trim()) }))}
            className="border p-3 rounded-lg"
          />
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleChange} /> Trending Product
          </label>

          {/* Sizes */}
          <div className="col-span-2">
            <p className="font-medium mb-1">Sizes</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {["XS","S","M","L","XL","XXL"].map((s) => (
                <button key={s} type="button" onClick={() => setForm((prev) => {
                  const sizes = prev.sizes || [];
                  if (sizes.includes(s)) return { ...prev, sizes: sizes.filter(sz => sz !== s) };
                  return { ...prev, sizes: [...sizes, s] };
                })}
                className={`px-3 py-1 rounded mb-2 text-sm font-medium border transition ${form.sizes?.includes(s) ? "bg-blue-700 text-white border-blue-700" : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="col-span-2">
            <p className="font-medium mb-2">Main Image</p>
            {mainPreview && <img src={mainPreview} alt="main" className="w-32 h-32 object-cover rounded-lg border mb-2" />}
            <label className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
              Upload Main Image
              <input type="file" accept="image/*" hidden onChange={handleMainUpload} />
            </label>
          </div>

          {/* Sub Images */}
          <div className="col-span-2">
            <p className="font-medium mb-2">Sub Images (Max 5)</p>
            <div className="flex flex-wrap gap-3 mb-2">
              {subPreviews.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`sub ${i}`} className="w-28 h-28 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removeSubImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
              Upload Sub Images
              <input type="file" multiple accept="image/*" hidden onChange={handleSubUpload} />
            </label>
          </div>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product Description" className="border p-3 rounded-lg col-span-2 h-24" />
        </div>

        <button type="submit" disabled={submitting} className="mt-5 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex justify-center items-center gap-2">
          {submitting ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Plus size={18} />{editingId ? "Update Product" : "Add Product"}</>}
        </button>
      </form>

      {/* Product Grid */}
      {loading ? <p className="text-center text-gray-500">Loading products...</p> :
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition relative group">
              <img src={p.mainImage || p.images?.[0]} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{p.category}</p>
              <p className="text-blue-700 font-bold mt-1">₹{p.price}</p>
              {p.isTrending && <span className="absolute top-3 right-3 bg-yellow-400 text-xs px-2 py-1 rounded-md">⭐ Trending</span>}
              <div className="flex justify-between mt-3 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(p)} className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 font-medium"><Pencil size={16} /> Edit</button>
                <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default AdminProducts;
