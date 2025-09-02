import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  image: string;
  categoryId: string;
  subCategoryId: string;
  status: "active" | "inactive";
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    categoryId: "",
    subCategoryId: "",
    status: "active",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:8081/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch subcategories
  useEffect(() => {
    fetch("http://localhost:8081/api/subcategories")
      .then((res) => res.json())
      .then((data: Subcategory[]) => setSubcategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" || name === "stock" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.categoryId || !form.subCategoryId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Product Added!",
          text: "The product has been added successfully.",
          confirmButtonText: "OK",
        }).then(() => navigate("/dashboard/products"));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to add product");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || JSON.stringify(err)));
    }
  };

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryId === form.categoryId
  );

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2>Add New Product</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </label>

              <label>
                Description:
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                />
              </label>

              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                />
              </label>

              <label>
                Stock:
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min={0}
                />
              </label>

              <label>
                Image URL:
                <input
                  type="file"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                />
              </label>

              <label>
                Category:
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Subcategory:
                <select
                  name="subCategoryId"
                  value={form.subCategoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select subcategory</option>
                  {filteredSubcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Status:
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
