import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
  subcategoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  adaptiveHeight: true,
};

const PRODUCTS_PER_PAGE = 4;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUserId(userObj.id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, subcatRes] = await Promise.all([
          fetch("http://localhost:8081/api/products"),
          fetch("http://localhost:8081/api/categories"),
          fetch("http://localhost:8081/api/subcategories"),
        ]);

        const productsData: any[] = await prodRes.json();
        const categoriesData: any[] = await catRes.json();
        const subcategoriesData: any[] = await subcatRes.json();

        setProducts(productsData.map((p) => ({
          ...p,
          id: String(p.id),
          categoryId: String(p.categoryId),
          subcategoryId: String(p.subcategoryId),
          stock: Number(p.stock || 0),
          price: Number(p.price),
        })));

        setCategories(categoriesData.map((c) => ({ ...c, id: String(c.id) })));
        setSubcategories(subcategoriesData.map((s) => ({ ...s, id: String(s.id), categoryId: String(s.categoryId) })));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!userId) return alert("Please login first!");
    try {
      const res = await fetch("http://localhost:8081/api/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product.id, quantity: 1 }),
      });
      if (res.ok) alert("✅ Product added to cart!");
      else console.error("Failed to add to cart:", await res.text());
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "All") return true;
    if (!selectedSubcategory) return product.categoryId === selectedCategory;
    return product.categoryId === selectedCategory && product.subcategoryId === selectedSubcategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="home-container">
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          <div className="slide">
            <img src="https://cdn.vectorstock.com/i/500p/20/83/3d-laptop-software-development-banner-vector-46322083.jpg" alt="Slide 1" />
            <div className="slide-text">
              <h2>Latest Collection 2025</h2>
              <p>Discover our newest products</p>
            </div>
          </div>
          <div className="slide">
            <img src="https://t4.ftcdn.net/jpg/02/69/15/39/360_F_269153974_8x5Mbf1vYy67OKDq7mArqXN5gZvixMnw.jpg" alt="Slide 2" />
            <div className="slide-text">
              <h2>Trendy Fashion</h2>
              <p>Upgrade your style now</p>
            </div>
          </div>
        </Slider>
      </div>

      <div className="categories">
        <button
          className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => { setSelectedCategory("All"); setSelectedSubcategory(null); setCurrentPage(1); }}
        >All</button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(null); setCurrentPage(1); }}
          >{cat.name}</button>
        ))}
      </div>

      <section className="products-section">
        <h2>
          {selectedSubcategory
            ? subcategories.find((sub) => sub.id === selectedSubcategory)?.name
            : selectedCategory !== "All"
              ? categories.find((cat) => cat.id === selectedCategory)?.name
              : "Our Products"}
        </h2>

        <div className="products-grid">
          {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.image && <img src={`http://localhost:8081${product.image}`} alt={product.name} />}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">₹{product.price}</p>
              <p className="stock">{product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}</p>

              <div className="product-buttons">
                <button className="category-btn" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>Add to Cart</button>
                <button className="category-btn" onClick={async () => { await handleAddToCart(product); navigate("/cart"); }} disabled={product.stock === 0}>Buy Now</button>
              </div>
            </div>
          )) : <p>No products found.</p>}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button key={idx + 1} className={currentPage === idx + 1 ? "active" : ""} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
