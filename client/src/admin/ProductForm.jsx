import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import {
  createProductRequest, fetchProductForEdit, updateProductRequest,
} from "../services/adminService";

const CATEGORIES = ["Men", "Women", "Kids", "Shoes", "Accessories"];

const EMPTY = {
  name: "", description: "", price: "", discountPrice: "0", category: "Men",
  subcategory: "", brand: "AttireHub", materials: "", sku: "", stock: "0",
  sizes: "", colors: "", images: "", featured: false, isNewArrival: false,
};

// Lists are typed as text: sizes and colors separated by commas, images one per line
const splitList = (text, separator) =>
  text.split(separator).map((s) => s.trim()).filter(Boolean);

function ProductForm() {
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let ignore = false;
    fetchProductForEdit(id)
      .then((p) => {
        if (ignore) return;
        setForm({
          name: p.name, description: p.description, price: String(p.price),
          discountPrice: String(p.discountPrice || 0), category: p.category,
          subcategory: p.subcategory || "", brand: p.brand || "", materials: p.materials || "",
          sku: p.sku, stock: String(p.stock), sizes: p.sizes.join(", "),
          colors: p.colors.join(", "), images: p.images.join("\n"),
          featured: p.featured, isNewArrival: p.isNewArrival,
        });
      })
      .catch((err) => {
        if (!ignore) setLoadError(err.response?.status === 404 ? "Product not found." : "Could not load the product.");
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const discountPrice = Number(form.discountPrice || 0);

    // Quick checks for fast feedback (the server checks everything again)
    if (!form.name.trim() || !form.description.trim() || !form.sku.trim()) {
      return setError("Name, description and SKU are required.");
    }
    if (!(price > 0)) return setError("Enter a price above 0.");
    if (discountPrice !== 0 && discountPrice >= price) {
      return setError("Sale price must be lower than the regular price (or 0 for no sale).");
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      discountPrice,
      category: form.category,
      subcategory: form.subcategory.trim(),
      brand: form.brand.trim(),
      materials: form.materials.trim(),
      sku: form.sku.trim(),
      stock: Number(form.stock),
      sizes: splitList(form.sizes, ","),
      colors: splitList(form.colors, ","),
      images: splitList(form.images, "\n"),
      featured: form.featured,
      isNewArrival: form.isNewArrival,
    };

    setSaving(true);
    try {
      if (isEdit) await updateProductRequest(id, payload);
      else await createProductRequest(payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (loadError) {
    return (
      <div>
        <ErrorMessage message={loadError} />
        <Link to="/admin/products">Back to products</Link>
      </div>
    );
  }

  const input = (name, label, props = {}) => (
    <div className={props.col || "col-12"}>
      <label htmlFor={`f-${name}`} className="form-label">{label}</label>
      <input id={`f-${name}`} name={name} className="form-control" value={form[name]}
        onChange={handleChange} {...props.input} />
      {props.help && <div className="form-text">{props.help}</div>}
    </div>
  );

  // Live preview of the first image
  const firstImage = splitList(form.images, "\n")[0];

  return (
    <div style={{ maxWidth: 820 }}>
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{isEdit ? "Edit" : "New"}</li>
        </ol>
      </nav>
      <h1 className="h3 mb-4">{isEdit ? "Edit product" : "Add product"}</h1>

      <form onSubmit={handleSubmit} noValidate className="card-attire p-4">
        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <div className="row g-3">
          {input("name", "Name")}
          <div className="col-12">
            <label htmlFor="f-description" className="form-label">Description</label>
            <textarea id="f-description" name="description" rows="3" className="form-control"
              value={form.description} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="f-category" className="form-label">Category</label>
            <select id="f-category" name="category" className="form-select" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {input("subcategory", "Subcategory", { col: "col-md-6" })}

          {input("price", "Price ($)", { col: "col-md-4", input: { type: "number", min: "0", step: "0.01" } })}
          {input("discountPrice", "Sale price ($)", {
            col: "col-md-4", input: { type: "number", min: "0", step: "0.01" },
            help: "0 means not on sale.",
          })}
          {input("stock", "Stock", { col: "col-md-4", input: { type: "number", min: "0", step: "1" } })}

          {input("sku", "SKU", { col: "col-md-6", help: "Must be unique, e.g. AH-0023." })}
          {input("brand", "Brand", { col: "col-md-6" })}

          {input("sizes", "Sizes", { help: "Separate with commas: XS, S, M, L, XL" })}
          {input("colors", "Colors", { help: "Separate with commas. Known names get a swatch: Black, Teal, Lavender" })}
          {input("materials", "Materials")}

          <div className="col-12">
            <label htmlFor="f-images" className="form-label">Image addresses</label>
            <textarea id="f-images" name="images" rows="3" className="form-control" value={form.images}
              onChange={handleChange} aria-describedby="img-help" />
            <div id="img-help" className="form-text">
              One per line. Use a full web address (https://...) or a path like /images/hoodie.jpg.
            </div>
            {firstImage && (
              <img src={firstImage} alt="Preview of the first image" className="mt-2 order-thumb"
                style={{ width: 90 }} />
            )}
          </div>

          <div className="col-12 d-flex flex-wrap gap-4">
            <div className="form-check">
              <input id="f-featured" name="featured" type="checkbox" className="form-check-input"
                checked={form.featured} onChange={handleChange} />
              <label htmlFor="f-featured" className="form-check-label">Featured</label>
            </div>
            <div className="form-check">
              <input id="f-new" name="isNewArrival" type="checkbox" className="form-check-input"
                checked={form.isNewArrival} onChange={handleChange} />
              <label htmlFor="f-new" className="form-check-label">New arrival</label>
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button type="submit" className="btn-attire" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link to="/admin/products" className="btn btn-outline-dark rounded-pill px-4">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;

