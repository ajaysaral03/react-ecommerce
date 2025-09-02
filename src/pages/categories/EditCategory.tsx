import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "../../assets/css/form.css";

interface Category {
  name: string;
}

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Category>({ name: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/categories/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load category");
        }
        const data = await res.json();
        setForm({ name: data.name });
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:8081/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // ✅ SweetAlert popup
        Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: "The category has been updated successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/dashboard/categories");
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to update category");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: " + (err.message || "Something went wrong"));
    }
  };

  if (loading) return <p>Loading category details...</p>;

  return (
    <div className="form-container">
      <h2>✏️ Edit Category</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Category Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter category name"
          required
        />

        <button type="submit">Update</button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "#777", marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
