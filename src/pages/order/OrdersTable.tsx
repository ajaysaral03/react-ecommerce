import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/table.css";

interface Order {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  orderNumber: string;
  totalAmount: number;
  discount: number;
  shippingCharge: number;
  orderStatus: string;
  shippingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

const OrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8081/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data || []); // 👈 corrected
      })
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  }, []);

  // Delete order
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (!result.isConfirmed) return;

      fetch(`http://localhost:8081/api/orders/${id}`, { method: "DELETE" })
        .then(async (res) => {
          if (res.ok) {
            Swal.fire("Deleted!", "Order deleted successfully.", "success");
            setOrders((prev) => {
              const updated = prev.filter((o) => o.id !== id);
              // Adjust page if last item removed
              if ((page - 1) * itemsPerPage >= updated.length && page > 1)
                setPage(page - 1);
              return updated;
            });
          } else {
            const data = await res.json().catch(() => null);
            Swal.fire("Error!", data?.message || res.statusText, "error");
          }
        })
        .catch(() => {
          Swal.fire("Error!", "Something went wrong.", "error");
        });
    });
  };

  // Filtered orders
  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (o.orderNumber || "").toLowerCase().includes(q) ||
      (o.orderStatus || "").toLowerCase().includes(q) ||
      (o.userName || "").toLowerCase().includes(q) ||
      (o.userEmail || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value?: number) =>
    value !== undefined ? `₹${value.toFixed(2)}` : "—";

  return (
    <div className="table-container">
      <h2>
        Order <span>Details</span>
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
          onClick={() => navigate("/dashboard/orders/add")}
        >
          + Add Order
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order No</th>
              <th>User</th>
              <th>Email</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Shipping</th>
              <th>Status</th>
              <th>Address</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order, idx) => (
                <tr key={order.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{order.orderNumber}</td>
                  <td>{order.userName || "—"}</td>
                  <td>{order.userEmail || "—"}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>{formatCurrency(order.discount)}</td>
                  <td>{formatCurrency(order.shippingCharge)}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.shippingAddress || "—"}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="actions">
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        navigate(`/dashboard/orders/edit/${order.id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", padding: "12px" }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <p>
          Showing <b>{currentItems.length}</b> of <b>{filtered.length}</b> entries
        </p>
        <div className="page-buttons">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={safePage === i + 1 ? "active" : ""}
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

export default OrdersTable;
