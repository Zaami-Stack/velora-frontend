import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";

const CATEGORIES = ["Blazers", "Dresses", "Tops", "Pants", "Knitwear", "Shoes", "Bags", "Accessories"];
const BADGES = ["", "New", "Sale"];

const emptyForm = {
  name: "",
  category: "Dresses",
  price: "",
  original_price: "",
  image: "",
  badge: "",
  rating: "4.5",
  reviews: "0",
  description: "",
  colors: [],
};

export default function ProductsPage() {
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [colorInput, setColorInput] = useState("");
  const [colorImageInput, setColorImageInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.products();
      setProducts(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ ...emptyForm, colors: [] });
    setColorInput("");
    setColorImageInput("");
    setModal("add");
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      image: p.image,
      badge: p.badge || "",
      rating: String(p.rating),
      reviews: String(p.reviews),
      description: p.description || "",
      colors: (p.colors || []).map((c) =>
        typeof c === "string" ? { hex: c, image: "" } : { hex: c.hex, image: c.image || "" }
      ),
    });
    setColorInput("");
    setColorImageInput("");
    setModal({ type: "edit", id: p.id });
  }

  function addColor() {
    let hex = colorInput.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (hex.length === 4) {
      hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex) && !form.colors.some((c) => c.hex === hex)) {
      setForm({ ...form, colors: [...form.colors, { hex, image: colorImageInput.trim() || "" }] });
      setColorInput("");
      setColorImageInput("");
    }
  }

  function removeColor(hex) {
    setForm({ ...form, colors: form.colors.filter((c) => c.hex !== hex) });
  }

  function updateColorImage(hex, image) {
    setForm({
      ...form,
      colors: form.colors.map((c) => (c.hex === hex ? { ...c, image } : c)),
    });
  }

  async function handleSave() {
    if (!form.name || !form.category || !form.price || !form.image) {
      toastError("Name, category, price, and image URL are required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        image: form.image,
        badge: form.badge || null,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        description: form.description || null,
        colors: form.colors,
      };

      if (modal?.type === "edit") {
        const updated = await api.admin.updateProduct(modal.id, payload);
        setProducts(products.map((p) => (p.id === modal.id ? updated : p)));
        success("Product updated");
      } else {
        const created = await api.admin.createProduct(payload);
        setProducts([...products, created]);
        success("Product created");
      }
      setModal(null);
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.admin.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      success("Product deleted");
    } catch (err) {
      toastError(err.message);
    }
  }

  const badgeColors = {
    New: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20",
    Sale: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} products in your store</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-950 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Product
        </button>
      </div>

      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/10 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{search ? "No products match your search" : "No products yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white/[0.03] rounded-xl border border-white/5 p-4 hover:bg-white/[0.05] transition-colors">
              <div className="flex gap-3">
                <img src={p.image} alt={p.name} className="w-16 h-20 rounded-lg object-cover bg-white/5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.category} &middot; ID: {p.id}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-white">${Number(p.price).toFixed(2)}</span>
                    {p.original_price && <span className="text-xs text-gray-500 line-through">${Number(p.original_price).toFixed(2)}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {p.badge ? (
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColors[p.badge] || ""}`}>{p.badge}</span>
                    ) : null}
                    <span className="text-[11px] text-gray-500">{p.rating} ({p.reviews})</span>
                  </div>
                </div>
              </div>
              {p.colors && p.colors.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                  {p.colors.slice(0, 6).map((c, i) => {
                    const hex = typeof c === "string" ? c : c.hex;
                    return <span key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: hex }} />;
                  })}
                  {p.colors.length > 6 && <span className="text-[10px] text-gray-500">+{p.colors.length - 6}</span>}
                </div>
              )}
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-white/5">
                <button onClick={() => openEdit(p)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">Edit</button>
                <button onClick={() => setDeleteConfirm(p)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === "add" || modal?.type === "edit") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{modal?.type === "edit" ? "Edit Product" : "Add Product"}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="Product name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Badge</label>
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20">
                    {BADGES.map((b) => <option key={b} value={b} className="bg-gray-900">{b || "None"}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Price *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="99.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Original Price</label>
                  <input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="129.00" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Reviews</label>
                  <input type="number" min="0" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Image URL *</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="https://..." />
                {form.image && <img src={form.image} alt="Preview" className="mt-2 w-16 h-20 rounded-lg object-cover bg-white/5" />}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none" placeholder="Product description..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Colors</label>
                <div className="space-y-2 mb-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} className="w-full sm:w-28 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="#1a1a1a" />
                    <input value={colorImageInput} onChange={(e) => setColorImageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="Image URL for this color (optional)" />
                    <button type="button" onClick={addColor} className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0">Add Color</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {form.colors.map((c) => (
                    <div key={c.hex} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/5">
                      <div className="w-5 h-5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span className="text-xs text-gray-400 shrink-0">{c.hex}</span>
                      <input value={c.image || ""} onChange={(e) => updateColorImage(c.hex, e.target.value)} className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20" placeholder="Image URL (optional)" />
                      {c.image && <img src={c.image} alt="" className="w-8 h-8 rounded object-cover bg-white/5 shrink-0" />}
                      <button onClick={() => removeColor(c.hex)} className="text-gray-500 hover:text-red-400 cursor-pointer shrink-0 text-lg leading-none">&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                {saving ? "Saving..." : modal?.type === "edit" ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Delete Product</h3>
                <p className="text-xs text-gray-400 mt-0.5">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-5">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-5 py-2 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 ring-1 ring-red-500/20 transition-colors cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
