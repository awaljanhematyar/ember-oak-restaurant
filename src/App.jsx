/**
 * Application shell, shared cart state, route transitions, and accessible site navigation.
 */
// ========================================
// APPLICATION DEPENDENCIES
// ========================================
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  Flame,
  Menu as MenuIcon,
  X,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { cleanCart, readStorage, writeStorage } from "./utils/shop.js";
import { menu } from "./data/menu.js";
import { Home, About, NotFound } from "./pages/Content.jsx";
import Menu from "./pages/Menu.jsx";
import Reservations from "./pages/Reservations.jsx";
import { Cart, Checkout } from "./pages/Shop.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";

// ========================================
// NAVIGATION CONFIGURATION
// ========================================
const navigation = [
  ["/", "Home"],
  ["/menu", "Menu"],
  ["/about", "Our Story"],
  ["/gallery", "Gallery"],
  ["/contact", "Contact"],
];
export default function App() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [cart, setCart] = useState(() =>
    cleanCart(readStorage("eo-cart-v1", [])),
  );
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const location = useLocation();

  // ========================================
  // PERSISTENCE AND PAGE EFFECTS
  // ========================================
  useEffect(() => {
    setStorageOk(writeStorage("eo-cart-v1", cart));
  }, [cart]);
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${{ "/": "Seasonal Dining", "/menu": "Menu", "/order": "Order Online", "/reservations": "Reservations", "/cart": "Your Cart", "/checkout": "Demo Checkout", "/about": "Our Story", "/gallery": "Gallery", "/contact": "Contact" }[location.pathname] || "Page Not Found"} | Ember & Oak Kitchen`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // ========================================
  // CART MANAGEMENT
  // ========================================
  function add(id) {
    const row = cart.find((r) => r.id === id);
    if (row?.quantity >= 20) {
      setNotice("Maximum 20 of each dish per demo order.");
      return;
    }
    setCart((previous) => {
      const found = previous.find((r) => r.id === id);
      return cleanCart(
        found
          ? previous.map((r) =>
              r.id === id ? { ...r, quantity: r.quantity + 1 } : r,
            )
          : [...previous, { id, quantity: 1 }],
      );
    });
    setNotice(`${menu.find((i) => i.id === id).name} added to your cart.`);
  }
  function update(id, quantity) {
    setCart((previous) =>
      cleanCart(previous.map((r) => (r.id === id ? { ...r, quantity } : r))),
    );
  }
  const count = cart.reduce((sum, r) => sum + r.quantity, 0);

  // ========================================
  // APPLICATION LAYOUT
  // ========================================
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="demo-banner">
        A fictional Toronto restaurant · A real taste of what’s possible{" "}
        <span>PORTFOLIO DEMO</span>
      </div>
      {/* ========================================
          PRIMARY NAVIGATION
          ======================================== */}
      <header className="site-header">
        <div className="nav-wrap">
          <Link
            className="brand"
            to="/"
            aria-label="Ember and Oak Kitchen home"
          >
            <Flame size={29} strokeWidth={1.2} />
            <span>
              EMBER <i>&</i> OAK<small>K I T C H E N</small>
            </span>
          </Link>
          <nav
            className={open ? "primary-nav is-open" : "primary-nav"}
            aria-label="Main navigation"
          >
            {navigation.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
            <NavLink to="/order" className="mobile-order">
              Order online
            </NavLink>
          </nav>
          <div className="nav-actions">
            <Link className="order-link" to="/order">
              Order online <ArrowUpRight size={14} />
            </Link>
            <Link
              className="cart-link"
              to="/cart"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag size={21} />
              {count > 0 && <span>{count}</span>}
            </Link>
            <Link className="reserve-link" to="/reservations">
              Reserve<span className="reserve-word"> a table</span>
            </Link>
            <button
              className="mobile-toggle icon-button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            >
              {open ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>
      {/* ========================================
          ACCESSIBLE FEEDBACK
          ======================================== */}
      <div
        role="status"
        aria-live="polite"
        className={notice ? "toast visible" : "toast"}
      >
        {notice}
      </div>
      {!storageOk && (
        <p className="storage-warning" role="status">
          Browser storage is unavailable. Your cart will last for this visit
          only.
        </p>
      )}
      {/* ========================================
          PAGE ROUTES
          ======================================== */}
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home add={add} />} />
          <Route path="/menu" element={<Menu add={add} />} />
          <Route path="/order" element={<Menu add={add} ordering />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/cart" element={<Cart cart={cart} update={update} />} />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} clear={() => setCart([])} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* ========================================
          SITE FOOTER
          ======================================== */}
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Link className="brand" to="/">
              <Flame size={27} />
              <span>
                EMBER <i>&</i> OAK<small>K I T C H E N</small>
              </span>
            </Link>
            <p>
              Exceptional Food.
              <br />
              Unforgettable Moments.
            </p>
          </div>
          <div>
            <h3>Come on in</h3>
            <Link to="/menu">Explore the menu</Link>
            <Link to="/reservations">Reservations</Link>
            <Link to="/order">Order online</Link>
          </div>
          <div>
            <h3>Around the table</h3>
            <Link to="/about">Our story</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Get in touch</Link>
          </div>
          <div>
            <h3>A little Toronto spirit</h3>
            <p>
              Toronto, Ontario
              <br />
              Dinner daily · 5 pm – 10 pm
              <br />
              Fictional location & hours
            </p>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} Ember & Oak Kitchen · Portfolio concept
          </span>
          <span>Demo only. No real bookings, orders or payments.</span>
        </div>
      </footer>
    </>
  );
}
