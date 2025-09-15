import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/form.css";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId: string;
  status: "active" | "inactive";
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    subCategoryId: "",
    status: "active",
  });

  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:8081/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch subcategories
  useEffect(() => {
    fetch("http://localhost:8081/api/subcategories")
      .then((res) => res.json())
      .then((data: Subcategory[]) => setSubcategories(data))
      .catch((err) => console.error("Error fetching subcategories:", err));
  }, []);

  // Fetch existing product
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8081/api/products/${id}`)
      .then((res) => res.json())
      .then((data: any) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          stock: data.stock || 0,
          categoryId: data.categoryId || "",
          subCategoryId: data.subCategoryId || "",
          status: data.status || "active",
        });
        setCurrentImage(data.image || null);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.categoryId || !form.subCategoryId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (image) formData.append("file", image);

      const res = await fetch(`http://localhost:8081/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Product Updated!",
          text: "The product has been updated successfully.",
          confirmButtonText: "OK",
        }).then(() => navigate("/dashboard/products"));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to update product");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || JSON.stringify(err)));
    }
  };

  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryId === form.categoryId
  );

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2>Edit Product</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product description"
                />
              </div>

              <div className="mb-3">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="mb-3">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  min={0}
                />
              </div>

              <div className="mb-3">
                <label>Change Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>

              {currentImage && (
                <div className="mb-3">
                  <label>Current Image:</label>
                  <div>
                    <img
                      src={`http://localhost:8081${currentImage}`}
                      alt={form.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label>Category:</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Subcategory:</label>
                <select
                  name="subCategoryId"
                  value={form.subCategoryId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select subcategory</option>
                  {filteredSubcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Status:</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-success">
                Update Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
