import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/form.css";

interface Category {
  id: string;
  name: string;
}

interface SubcategoryForm {
  name: string;
  categoryId: string;
  status: number; // ✅ status add
}

const AddSubcategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<SubcategoryForm>({
    name: "",
    categoryId: "",
    status: 1, // ✅ default active
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ status हमेशा number रहे
    if (name === "status") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ✅ status भी जाएगा
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Subcategory Added!",
          text: "The subcategory has been added successfully.",
          confirmButtonText: "OK",
        }).then(() => navigate("/dashboard/subcategories"));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to add subcategory");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="form-container">
            <h2>Add New Subcategory</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Subcategory Name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Subcategory Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter subcategory name"
                  />
                </div>

                {/* Category */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Button */}
              <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary">
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategory;
