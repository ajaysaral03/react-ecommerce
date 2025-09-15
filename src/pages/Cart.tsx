import React, { useEffect, useState } from "react";
import "../styles/cart.css";

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

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface OrderSummary {
  orderId: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalAmount: number;
  shippingAddress: string;
  paymentStatus: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // ✅ Fixed constants
  const discount = 100;
  const shippingCharge = 50;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setLoading(false);
  }, []);

  const fetchCart = async (userId: string) => {
    try {
      const [cartRes, productRes] = await Promise.all([
        fetch(`http://localhost:8081/api/carts/${userId}`),
        fetch("http://localhost:8081/api/products"),
      ]);
      const cartData: CartItem[] = await cartRes.json();
      const products: Product[] = await productRes.json();

      const mergedCart = cartData.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));

      setCartItems(mergedCart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart(user.id);
  }, [user]);

  const handleRemove = async (cartId: string) => {
    try {
      await fetch(`http://localhost:8081/api/carts/${cartId}`, { method: "DELETE" });
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Correct calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const totalAmount = subtotal - discount + shippingCharge;

  // ✅ Payment simulation (replace with Razorpay/Stripe later)
  const processPayment = async (amount: number) => {
    return new Promise<{ status: string }>((resolve) => {
      setTimeout(() => resolve({ status: "Paid" }), 2000);
    });
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    setCheckoutLoading(true);

    try {
      // 1️⃣ Create Order
      const orderPayload = {
        userId: user.id,
        orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
        subtotal,
        totalAmount,
        discount,
        shippingCharge,
        shippingAddress: "221B Baker Street, London",
      };

      const orderRes = await fetch("http://localhost:8081/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error("Order creation failed");
      const order = await orderRes.json(); // ✅ must contain order.id

      // 2️⃣ Create Order Items using correct order.id
      for (const item of cartItems) {
        const orderItemPayload = {
          orderId: order.id, // ✅ fixed here
          productId: item.productId,
          productName: item.product?.name || "Product",
          quantity: item.quantity,
          unitPrice: item.product?.price || 0,
          totalPrice: (item.product?.price || 0) * item.quantity,
        };

        const itemRes = await fetch("http://localhost:8081/api/order-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderItemPayload),
        });

        if (!itemRes.ok) throw new Error("OrderItem creation failed");
      }

      // 3️⃣ Payment simulation
      const payment = await processPayment(totalAmount);

      // 4️⃣ Set Order Summary
      setOrderSummary({
        orderId: order.id,
        orderNumber: order.orderNumber,
        items: cartItems,
        subtotal,
        discount,
        shippingCharge,
        totalAmount,
        shippingAddress: order.shippingAddress,
        paymentStatus: payment.status,
      });

      // 5️⃣ Empty Cart
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ✅ Print Invoice
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p>Loading your cart...</p>;
  if (!user) return <p>Please login to view your cart.</p>;

  if (orderSummary) {
    return (
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>
          <strong>Order ID:</strong> {orderSummary.orderId}
        </p>
        <p>
          <strong>Order Number:</strong> {orderSummary.orderNumber}
        </p>
        <p>
          <strong>User:</strong> {user.name} ({user.email})
        </p>
        <p>
          <strong>Shipping Address:</strong> {orderSummary.shippingAddress}
        </p>
        <p>
          <strong>Payment Status:</strong> {orderSummary.paymentStatus}
        </p>

        <table className="cart-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderSummary.items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.product?.name}</td>
                <td>₹{item.product?.price}</td>
                <td>{item.quantity}</td>
                <td>₹{(item.product?.price || 0) * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals-wrapper">
          <p>Subtotal: ₹{orderSummary.subtotal}</p>
          <p>Discount: ₹{orderSummary.discount}</p>
          <p>Shipping: ₹{orderSummary.shippingCharge}</p>
          <p>
            <strong>Grand Total: ₹{orderSummary.totalAmount}</strong>
          </p>
        </div>

        <button onClick={handlePrint} className="print-btn">🖨 Print Invoice</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>{user.name}'s Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.product?.image && (
                      <img
                        src={
                          item.product.image.startsWith("http")
                            ? item.product.image
                            : `http://localhost:8081${item.product.image}`
                        }
                        alt={item.product.name}
                        className="cart-item-image"
                      />
                    )}
                  </td>
                  <td>{item.product?.name}</td>
                  <td>{item.product?.description}</td>
                  <td>₹{item.product?.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{(item.product?.price || 0) * item.quantity}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals-wrapper">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Discount: ₹{discount}</p>
            <p>Shipping: ₹{shippingCharge}</p>
            <p>
              <strong>Grand Total: ₹{totalAmount}</strong>
            </p>
          </div>

          <div className="checkout-wrapper">
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
