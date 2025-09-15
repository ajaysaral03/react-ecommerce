import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Website Pages
import WebsiteLayout from "./layouts/WebsiteLayout";
import WebsiteHome from "./pages/website/Home";
import ProductsHome from "./pages/website/Products";
import WebsiteLogin from "./pages/Login";
import Cart from "./pages/Cart";
// import About from "./pages/website/About";
// import ProductsPage from "./pages/website/Products";
// import Contact from "./pages/website/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Layout + Pages
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import OrdersTable from "./pages/order/OrdersTable";
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
import EditProduct from "./pages/products/EditProduct"; 

function App() {
  return (
    <Router>
      <Routes>

        {/* Website Routes */}
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<WebsiteHome />} />
           <Route path="login" element={<WebsiteLogin />} />
            <Route path="cart" element={<Cart />} />  
            <Route path="products" element={<ProductsHome />} />  
          {/* <Route path="about" element={<About />} /> */}
          {/* <Route path="products" element={<ProductsPage />} />
          <Route path="contact" element={<Contact />} /> */}
         
        </Route>

        {/* Dashboard Routes */}
         <Route path="admin" element={<Login />} />
          <Route path="register" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="subcategories" element={<Subcategories />} />
          <Route path="subcategories/add" element={<AddSubcategory />} />
          <Route path="subcategories/edit/:id" element={<EditSubcategory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/edit/:id" element={<EditCustomer />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<OrdersTable />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
