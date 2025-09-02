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
}

const AddSubcategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<SubcategoryForm>({
    name: "",
    categoryId: "",
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
    setForm({ ...form, [e.target.name]: e.target.value });
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
        body: JSON.stringify(form),
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
                <div className="col-md-6 mb-3">
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
                <div className="col-md-6 mb-3">
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
