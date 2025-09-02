import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Orders from "./pages/dashboard/Orders";
import Customers from "./pages/dashboard/Customers";
import EditCustomer from "./pages/dashboard/EditCustomer";  
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";
import Subcategories from "./pages/subcategories/Subcategories"; 
import AddSubcategory from "./pages/subcategories/AddSubcategory"; 
import EditSubcategory from "./pages/subcategories/EditSubcategory"; 
import Products from "./pages/products/Products"; 
import AddProduct from "./pages/products/AddProduct"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route → Login page */}
        <Route path="/" element={<Login />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          
          {/* Categories */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          {/* Subcategories */}
          <Route path="subcategories" element={<Subcategories />} />
          <Route path="subcategories/add" element={<AddSubcategory />} />
          <Route path="subcategories/edit/:id" element={<EditSubcategory />} />

          {/* Customers */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/edit/:id" element={<EditCustomer />} />

          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} /> {/* ✅ Fixed */}

          {/* Orders */}
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
