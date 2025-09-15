import React, { useEffect, useState } from "react";

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSubCategories, setTotalSubCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalCategories();
    fetchTotalSubCategories();
    fetchTotalProducts();
  }, []);

  // ✅ Fetch total users
  const fetchTotalUsers = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/users/count");
      const data = await response.json();
      setTotalUsers(data.data);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  // ✅ Fetch total categories
  const fetchTotalCategories = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/categories/count");
      const data = await response.json();
      setTotalCategories(data.data);
    } catch (error) {
      console.error("Error fetching total categories:", error);
    }
  };

  // ✅ Fetch total subcategories
  const fetchTotalSubCategories = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/subcategories/count");
      const data = await response.json();
      setTotalSubCategories(data.data);
    } catch (error) {
      console.error("Error fetching total subcategories:", error);
    }
  };

  // ✅ Fetch total products
  const fetchTotalProducts = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products/count");
      const data = await response.json();
      setTotalProducts(data.data);
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="cards">
        <div className="card purple">
          <h4>Total Users</h4>
          <p>{totalUsers}</p>
        </div>

        <div className="card red">
          <h4>Total Categories</h4>
          <p>{totalCategories}</p>
        </div>

        <div className="card yellow">
          <h4>Total SubCategories</h4>
          <p>{totalSubCategories}</p>
        </div>

        <div className="card green">
          <h4>Total Products</h4>
          <p>{totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
