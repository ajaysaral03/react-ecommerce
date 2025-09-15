import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/table.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  subCategoryName: string;
  image?: string; // ✅ image added
}

const ProductsTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:8081/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

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
      const res = await fetch(`http://localhost:8081/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        Swal.fire("Deleted!", "Product deleted successfully.", "success");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire("Error!", data.message || res.statusText, "error");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Filter and paginate
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategoryName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-container">
      <h2>Product <span>Details</span></h2>

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
          onClick={() => navigate("/dashboard/products/add")}
        >
          + Add Product
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Image</th> 
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((prod, idx) => (
              <tr key={prod.id}>
                <td>{startIndex + idx + 1}</td>
                <td>{prod.name}</td>
                <td>{prod.categoryName}</td>
                <td>{prod.subCategoryName}</td>
                                <td>
                  {prod.image ? (
                    <a
                      href={`http://localhost:8081${prod.image}`} 
                      target="_blank" // new tab
                      rel="noopener noreferrer" 
                    >
                      <img
                        src={`http://localhost:8081${prod.image}`} 
                        alt={prod.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          cursor: "pointer"
                        }}
                      />
                    </a>
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>₹{prod.price}</td>
                <td>{prod.stock}</td>
                <td className="actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => navigate(`/dashboard/products/edit/${prod.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(prod.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "12px" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <p>
          Showing <b>{currentItems.length}</b> of <b>{filtered.length}</b> entries
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

export default ProductsTable;
