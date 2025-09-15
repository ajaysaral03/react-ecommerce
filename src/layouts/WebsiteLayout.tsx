import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../styles/website.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

function WebsiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchCart(parsedUser.id); // fetch cart immediately
    }
  }, []);

  // 🛒 Fetch cart for the logged-in user
  const fetchCart = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/carts/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data: CartItem[] = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // ✅ Add item to cart dynamically
  const handleAddToCart = async (product: CartItem) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");
      const newCartItem: CartItem = await res.json();

      // ✅ Update cart state dynamically
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === newCartItem.productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === newCartItem.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...newCartItem }];
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]); // clear cart on logout
    navigate("/login");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="website-layout">
      {/* Header */}
      <header className="website-header">
        <div className="navbar-container">
          <div className="logo">
            <Link to="/">MyStore</Link>
          </div>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
          </nav>

          <div className="header-right" style={{ display: "flex", gap: "10px" }}>
            <input type="text" placeholder="Search..." className="search-bar" />

            {/* Cart Icon */}
            <div className="cart-icon" style={{ position: "relative" }}>
              <Link to="/cart">🛒</Link>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                    backgroundColor: "red",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            {/* User Info */}
            {user ? (
              <div className="user-info" style={{ display: "flex", gap: "10px" }}>
                {user.image && (
                  <img
                    src={`http://localhost:8081${user.image}`}
                    alt={user.name}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <span>{user.name}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="user-icon">
                👤
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="website-content">
        <Outlet context={{ handleAddToCart, cart, fetchCart }} />
      </main>

      {/* Footer */}
      <footer className="website-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} MyStore. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default WebsiteLayout;
