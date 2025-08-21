import { ShoppingBasket, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import UserIcon from "./UserIcon";
import { useGetCategoriesTreeQuery } from "../redux/queries/productApi";
import clsx from "clsx";
import logo from "/images/logo.svg";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();
  const menuRef = useRef();

  // Close dropdown if clicked outside (mobile)
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Banner */}
      {storeStatus?.[0]?.banner?.trim() && (
        <div className="bg-black text-white text-center py-2 px-4 text-sm lg:text-base font-semibold">
          {storeStatus[0].banner}
        </div>
      )}

      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 font-semibold text-gray-700">
            <Link
              to="/"
              className={clsx(
                "hover:text-rose-500 transition",
                pathname === "/" && "text-rose-500 border-b-2 border-rose-500"
              )}>
              Home
            </Link>
            {categoryTree?.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className={clsx(
                  "hover:text-rose-500 transition flex items-center gap-1",
                  pathname.includes(`/category/${encodeURIComponent(cat.name)}`) &&
                    "text-rose-500 border-b-2 border-rose-500"
                )}>
                {cat.name}
                {cat.children?.length > 0 && <ChevronDown size={16} />}
              </Link>
            ))}
            <Link
              to="/cart"
              className={clsx(
                "hover:text-rose-500 transition",
                pathname === "/cart" && "text-rose-500 border-b-2 border-rose-500"
              )}>
              Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})
            </Link>
          </nav>

          {/* Right side: User + Cart + Mobile menu button */}
          <div className="flex items-center gap-4">
            <UserIcon userInfo={userInfo} />

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingBasket strokeWidth={1.5} size={28} />
              <span className="absolute -top-2 -right-2 text-xs bg-rose-500 text-white px-2 rounded-full font-bold">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 bg-white shadow-lg p-6 z-40 flex flex-col gap-4 font-semibold">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              {categoryTree?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
