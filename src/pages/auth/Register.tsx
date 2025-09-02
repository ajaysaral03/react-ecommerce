import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/register.css";
    
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
    phone: "",
    status: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || "Registration failed");
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500); // wait 1.5 seconds before redirect
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
<div className="register-container">
  <div className="register-box">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button type="submit">Register</button>
    </form>
    <p>
      Already have an account? <Link to="/">Login</Link>
    </p>
  </div>
</div>

  );
};

export default Register;
