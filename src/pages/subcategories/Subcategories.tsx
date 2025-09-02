import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/table.css";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  slug: string;
  location: string;
  page: string;
  status: number;
}

const Subcategories = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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

  // Delete handler
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8081/api/subcategories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire("Deleted!", "Subcategory deleted successfully.", "success");
        setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire("Error!", data.message || res.statusText, "error");
      }
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      Swal.fire("Error!", "Something went wrong. Check console.", "error");
    }
  };

  // Map categoryId → categoryName
  const mappedSubcategories = subcategories.map((sub) => {
    const category = categories.find((c) => c.id === sub.categoryId);
    return { ...sub, categoryName: category ? category.name : "Unknown" };
  });

  // Filter + Pagination
  const filtered = mappedSubcategories.filter(
    (sub) =>
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      (sub.categoryName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-container">
      <h2>
        Subcategory <span>Details</span>
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
          onClick={() => navigate("/dashboard/subcategories/add")}
        >
          + Add Subcategory
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name ⬍</th>
            <th>Category ⬍</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((sub, index) => (
            <tr key={sub.id}>
              <td>{startIndex + index + 1}</td>
              <td>{sub.name}</td>
              <td>{sub.categoryName}</td>
              <td className="actions">
                <button
                  className="icon-btn edit"
                  onClick={() =>
                    navigate(`/dashboard/subcategories/edit/${sub.id}`)
                  }
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(sub.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "12px" }}>
                No subcategories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <p>
          Showing <b>{currentItems.length}</b> out of <b>{filtered.length}</b>{" "}
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

export default Subcategories;
