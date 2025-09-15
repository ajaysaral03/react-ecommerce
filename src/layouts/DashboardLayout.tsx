import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaList,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "../assets/css/dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [subCategoriesOpen, setSubCategoriesOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // ✅ Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch("http://localhost:8081/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/admin", { replace: true });
    }
  };

  // ✅ Dropdown toggles
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
    setSubCategoriesOpen(false);
  };

  const toggleSubCategories = () => {
    setSubCategoriesOpen(!subCategoriesOpen);
    setCategoriesOpen(false);
  };

  return (
    <div className="dashboard">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        <div className="profile">
          <img
            className="profile-img"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtKup1GDVsyW_AGU9LCazfp7ioYlalWh-Y8w&s"
            alt="profile"
          />
          <h3>{user?.name || "User"}</h3>
          <small>{user?.role || "GUEST"}</small>
        </div>

        <nav>
          <ul>
            {/* Common for all */}
            <li>
              <Link to="/dashboard">
                <FaTachometerAlt className="sidebar-icon" />
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>

            {/* ✅ ADMIN ONLY */}
            {user?.role === "admin" && (
              <>
                <li>
                  <Link to="/dashboard/customers">
                    <FaUsers className="sidebar-icon" />
                    <span className="sidebar-text">Customers</span>
                  </Link>
                </li>

                {/* Categories */}
                <li className="dropdown">
                  <button className="dropdown-btn" onClick={toggleCategories}>
                    <FaList className="sidebar-icon" />
                    <span className="sidebar-text">Categories ▾</span>
                  </button>
                  {categoriesOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/dashboard/categories">All Categories</Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Sub Categories */}
                <li className="dropdown">
                  <button className="dropdown-btn" onClick={toggleSubCategories}>
                    <FaList className="sidebar-icon" />
                    <span className="sidebar-text">Sub Categories ▾</span>
                  </button>
                  {subCategoriesOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/dashboard/subcategories">
                          All Sub Categories
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link to="/dashboard/products">
                    <FaBox className="sidebar-icon" />
                    <span className="sidebar-text">Products</span>
                  </Link>
                </li>
                <li>
                <Link to="/dashboard/orders">
                  <FaShoppingCart className="sidebar-icon" />
                  <span className="sidebar-text">My Orders</span>
                </Link>
              </li>
            <li>
            <Link to="" onClick={handleLogout}>
              <FaSignOutAlt className="sidebar-icon" />
              <span className="sidebar-text">Logout</span>
            </Link>
          </li>
                        </>
            )}

            {/* ✅ USER ONLY */}
            {user?.role === "user" && (
              <li>
                <Link to="/dashboard/orders">
                  <FaShoppingCart className="sidebar-icon" />
                  <span className="sidebar-text">My Orders</span>
                </Link>
              </li>
            )}

            {/* ✅ Settings (common) */}
            <li>
              <Link to="/dashboard/settings">
                <FaCog className="sidebar-icon" />
                <span className="sidebar-text">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <input
            type="text"
            placeholder="Search products, orders..."
            className="search-bar"
          />

          <div className="user-info">
            <img src="/profile.jpg" alt="user" className="user-img" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
