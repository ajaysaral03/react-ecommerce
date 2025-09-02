import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "../../assets/css/table.css";

interface Category {
  id: string;
  name: string;
}

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:8081/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Delete category with SweetAlert confirmation
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8081/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category deleted successfully.",
        });
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: data.message || res.statusText,
        });
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Check console for details.",
      });
    }
  };

  // ✅ Filtering + Pagination
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-container">
      <h2>
        Category <span>Details</span>
      </h2>

      <div className="table-top">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button
          className="add-btn"
          onClick={() => navigate("/dashboard/categories/add")}
        >
          + Add Category
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name ⬍</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((cat, index) => (
            <tr key={cat.id}>
              <td>{startIndex + index + 1}</td>
              <td>{cat.name}</td>
              <td className="actions">
                <button
                  className="icon-btn edit"
                  onClick={() => navigate(`/dashboard/categories/edit/${cat.id}`)}
                >
                  <FaEdit />
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(cat.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}

          {currentItems.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "12px" }}>
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <p>
          Showing <b>{currentItems.length}</b> out of <b>{categories.length}</b>{" "}
          entries
        </p>
        <div className="page-buttons">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
