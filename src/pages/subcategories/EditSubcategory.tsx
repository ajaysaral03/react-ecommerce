import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/form.css";

interface Category {
  id: string;
  name: string;
}

interface SubcategoryForm {
  name: string;
  categoryId: string;
}

const EditSubcategory = () => {
  const { id } = useParams(); // subcategory id from route
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<SubcategoryForm>({
    name: "",
    categoryId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all categories
    fetch("http://localhost:8081/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch subcategory details
    fetch(`http://localhost:8081/api/subcategories/${id}`)
      .then((res) => res.json())
      .then((data: SubcategoryForm) => setForm(data))
      .catch((err) => console.error("Error fetching subcategory:", err));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8081/api/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Subcategory Updated!",
          text: "The subcategory has been updated successfully.",
          confirmButtonText: "OK",
        }).then(() => navigate("/dashboard/subcategories"));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to update subcategory");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="container my-5">
      <div className="form-container col-md-6 mx-auto">
        <h2>Edit Subcategory</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">Subcategory Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter subcategory name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubcategory;
