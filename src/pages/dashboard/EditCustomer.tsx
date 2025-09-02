import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/css/form.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: number;
}

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8081/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setCustomer(data.data);
        } else {
          Swal.fire("Error", "User not found", "error");
          navigate("/dashboard/customers");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        Swal.fire("Error", "Failed to fetch user", "error");
        navigate("/dashboard/customers");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (customer) {
      let value: string | number = e.target.value;

      // convert status to number
      if (e.target.name === "status") {
        value = parseInt(value, 10);
      }

      setCustomer({ ...customer, [e.target.name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) return;

    try {
      const res = await fetch(`http://localhost:8081/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (res.ok) {
        Swal.fire("Success", "User updated successfully", "success");
        navigate("/dashboard/customers");
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire("Error", data.message || "Failed to update", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>User not found</p>;

  return (
    <div className="form-container">
      <h2>Edit Customer</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select
          name="role"
          value={customer.role}
          onChange={handleChange}
          required
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>



        <button type="submit" className="btn-save">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCustomer;
