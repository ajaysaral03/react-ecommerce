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
import "../assets/css/dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [subCategoriesOpen, setSubCategoriesOpen] = useState(false);

  // ✅ Logout handler
  const handleLogout = () => {
    navigate("/");
  };

  // ✅ Toggle functions
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
    setSubCategoriesOpen(false); // Close subcategories if open
  };

  const toggleSubCategories = () => {
    setSubCategoriesOpen(!subCategoriesOpen);
    setCategoriesOpen(false); // Close categories if open
  };

  return (
    <div className="dashboard">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        {/* Profile Section */}
        <div className="profile">
          <img className="profile-img" src="/profile.jpg" alt="profile" />
          <h3>Ajay Saral</h3>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul>
            {/* Dashboard */}
            <li>
              <Link to="/dashboard">
                <FaTachometerAlt className="sidebar-icon" />
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
              {/* Customers - FIRST */}
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
                    <Link to="/dashboard/subcategories">All Sub Categories</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Products */}
            <li>
              <Link to="/dashboard/products">
                <FaBox className="sidebar-icon" />
                <span className="sidebar-text">Products</span>
              </Link>
            </li>

            {/* Orders */}
            <li>
              <Link to="/dashboard/orders">
                <FaShoppingCart className="sidebar-icon" />
                <span className="sidebar-text">Orders</span>
              </Link>
            </li>



            {/* Settings */}
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
            <span className="username">Ajay Saral</span>
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
