import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "../../assets/css/form.css";

interface CategoryForm {
  name: string;
}

const AddCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CategoryForm>({ name: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name) {
      setError("Please fill in the category name");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // ✅ SweetAlert success popup
        Swal.fire({
          icon: "success",
          title: "Category Added!",
          text: "The category has been added successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/dashboard/categories"); // Navigate after confirmation
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to add category");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-container">
            <h2>Add New Category</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                />
              </label>
              <button type="submit">Add Category</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
