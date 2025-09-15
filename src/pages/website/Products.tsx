import React, { useEffect, useState } from "react";
import "../../styles/products.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  subCategoryName: string;
  image?: string;
}

interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/products");
        if (!res.ok) throw new Error("API error");

        const data: any[] = await res.json();

        // Normalize data
        const mapped = data.map((p) => ({
          id: String(p.id),
          name: p.name,
          description: p.description || "",
          price: Number(p.price),
          stock: Number(p.stock || 0),
          categoryName: p.categoryName || "",
          subCategoryName: p.subCategoryName || "",
          image: p.image,
        }));

        setProducts(mapped);
      } catch (error) {
        console.error("❌ Error fetching products:", error);

        // Dummy fallback data
        setProducts([
          {
            id: "p1",
            name: "Smartphone",
            description: "Latest Android smartphone",
            price: 15000,
            stock: 20,
            categoryName: "Electronics",
            subCategoryName: "Mobiles",
            image: "https://via.placeholder.com/150",
          },
          {
            id: "p2",
            name: "Headphones",
            description: "Noise-cancelling headphones",
            price: 2000,
            stock: 50,
            categoryName: "Electronics",
            subCategoryName: "Audio",
            image: "https://via.placeholder.com/150",
          },
          {
            id: "p3",
            name: "Laptop",
            description: "High-performance laptop",
            price: 55000,
            stock: 10,
            categoryName: "Computers",
            subCategoryName: "Laptops",
            image: "https://via.placeholder.com/150",
          },
        ]);
      }
    };

    fetchProducts();

    // User setup
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser).id);
    } else {
      setUserId("guest123");
    }
  }, []);

  const addToCart = (product: Product) => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: Date.now().toString(),
        userId,
        productId: product.id,
        quantity: 1,
        product,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-container">
      <h2>All Products</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.image && (
                <img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `http://localhost:8081${product.image}`
                  }
                  alt={product.name}
                />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>₹{product.price}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Products;
