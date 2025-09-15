import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/table.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: number; // 1 = Active, 0 = Inactive
}

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [error, setError] = useState("");

  // ✅ Fetch all users
  useEffect(() => {
    fetch("http://localhost:8081/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setCustomers(data.data);
        } else {
          setCustomers([]);
          setError("No users found");
        }
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers");
      });
  }, []);

  // ✅ Delete with SweetAlert
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8081/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire("Deleted!", "User deleted successfully.", "success");
        setCustomers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire("Error!", data.message || res.statusText, "error");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // ✅ Toggle Status
  const handleStatusToggle = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // number

    try {
      const res = await fetch(`http://localhost:8081/api/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await res.json();
        Swal.fire("Success!", "Status updated successfully.", "success");
        setCustomers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: newStatus } : u
          )
        );
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire("Error!", data.message || res.statusText, "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // ✅ Filtering + Pagination
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-container">
      <h2>
        Customers <span>List</span>
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
      </div>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name ⬍</th>
            <th>Email ⬍</th>
            <th>Phone ⬍</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((cust, index) => (
              <tr key={cust.id}>
                <td>{startIndex + index + 1}</td>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.role}</td>
                <td>
                  <button
                    className={cust.status === 1 ? "btn-active" : "btn-inactive"}
                    onClick={() => handleStatusToggle(cust.id, cust.status)}
                  >
                    {cust.status === 1 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="actions">
                  <button
                    className="icon-btn edit"
                    onClick={() =>
                      navigate(`/dashboard/customers/edit/${cust.id}`)
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(cust.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <p>
          Showing <b>{currentItems.length}</b> out of <b>{customers.length}</b>{" "}
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



export default Customers;
