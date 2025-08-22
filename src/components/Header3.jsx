import {
  ShoppingBasket,
  ShoppingCart,
  Menu,
  X,
  Search as SearchIcon,
  User as UserIconSvg,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";
import logo from "/images/logo.svg";
import { useGetCategoriesTreeQuery, useGetProductsQuery } from "../redux/queries/productApi";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

export default function Header({ onSearch }) {
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noProductFound, setNoProductFound] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const { data: products = [] } = useGetProductsQuery();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();

  const menuRef = useRef();
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleClick = () => setClicked(!clicked);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClicked(false);
        setExpandedCategoryId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (clicked) document.body.classList.add("no-scroll");
    else {
      document.body.classList.remove("no-scroll");
      setNoProductFound(false);
      setExpandedCategoryId(null);
    }
  }, [clicked]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setNoProductFound(false);
    if (onSearch) onSearch(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const matchedProduct = products.find(
        (product) => product.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (matchedProduct) {
        navigate(`/products/${matchedProduct._id}`);
        setClicked(false);
        setNoProductFound(false);
      } else setNoProductFound(true);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/*   {storeStatus?.[0]?.banner?.trim() && (
        <div className="bg-white  text-white text-center py-2 px-4 text-sm lg:text-base font-semibold break-words">
          {storeStatus[0].banner}
        </div>
      )} */}
      <motion.header
        className={clsx(
          "fixed top-0 p-2 md:p-0 left-0 right-0  z-50 transition-all duration-300 ",
          " border-b border-white/[0.02]",
          pathname === "/"
            ? isScrolled
              ? "bg-white/[0.02] text-black backdrop-blur-md"
              : "bg-white/[0.02] text-white"
            : ""
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}>
        {storeStatus?.[0]?.banner?.trim() && (
          <div className="backdrop-blur-lg bg-rose-500  text-white text-center py-2 px-4 text-sm lg:text-base font-semibold break-words">
            {storeStatus[0].banner}
          </div>
        )}
        <div className="container-custom">
          <div className="flex items-center justify-between h-12 lg:h-16 relative">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}>
              <Link
                to="/"
                className={clsx("text-xl lg:text-2xl font-bold tracking-tight transition-colors")}
                aria-label="KATACHI Studio Home">
                Ecommerce
              </Link>
            </motion.div>
            <nav className="hidden md:flex space-x-6 w-[40%] justify-center relative ">
              <Link to="/" className="text-sm font-medium hover:opacity-50">
                Home
              </Link>

              {/* Category mega menu */}
              <div className="relative">
                <button
                  onClick={() => setExpandedCategoryId((prev) => (prev === "all" ? null : "all"))}
                  className="text-sm font-medium cursor-pointer hover:opacity-50 flex items-center space-x-1">
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      expandedCategoryId === "all" ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedCategoryId === "all" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-3 left-0 w-[700px] bg-white shadow-2xl rounded-lg border border-gray-200 p-6 grid grid-cols-3 gap-6 z-20">
                      {categoryTree?.map((cat) => (
                        <div key={cat._id}>
                          <Link
                            to={`/category/${cat.name}`}
                            onClick={() => setExpandedCategoryId(null)}
                            className="block font-semibold text-gray-800 hover:text-rose-600">
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </Link>

                          {cat.children?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {cat.children.map((subcat) => (
                                <li key={subcat._id}>
                                  <Link
                                    to={`/category/${subcat.name}`}
                                    onClick={() => setExpandedCategoryId(null)}
                                    className="text-sm text-gray-600 hover:text-rose-500">
                                    {subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={clsx(
                  "text-sm font-medium hover:opacity-50",
                  pathname === "/about" && "text-rose-600"
                )}>
                About
              </Link>
              <Link
                to="/contact"
                className={clsx(
                  "text-sm font-medium hover:opacity-50",
                  pathname === "/contact" && "text-rose-600"
                )}>
                Contact
              </Link>
            </nav>
            {/* Desktop user & cart */}
            <div
              className={clsx(
                "hidden md:flex items-center space-x-6 justify-end",
                pathname === "/"
                  ? isScrolled
                    ? "bg-white/[0.02] text-black"
                    : "bg-white/[0.02] text-white"
                  : ""
              )}>
              {userInfo ? (
                <Link
                  to="/profile"
                  className={clsx(
                    "flex items-center space-x-1  hover:opacity-50",
                    pathname === "/"
                      ? isScrolled
                        ? "bg-white/[0.02] text-black"
                        : "bg-white/[0.02] text-white"
                      : ""
                  )}>
                  <UserIconSvg className="h-5 w-5" />
                  {userInfo?.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={clsx(
                    " px-3 py-2 hover:opacity-80  rounded-lg",
                    pathname === "/"
                      ? isScrolled
                        ? "bg-white/[0.02] text-black"
                        : "bg-white/[0.02] text-white"
                      : ""
                  )}>
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                className={clsx(
                  "relative flex items-center text-black hover:opacity-50",
                  pathname === "/"
                    ? isScrolled
                      ? "bg-white/[0.02] text-black"
                      : "bg-white/[0.02] text-white"
                    : ""
                )}>
                <ShoppingCart strokeWidth={2} size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-base rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="flex items-center space-x-3 md:hidden">
              {userInfo ? (
                <Link
                  to="/profile"
                  className={clsx(
                    "text-gray-700 hover:opacity-50 flex items-center gap-1",
                    pathname === "/"
                      ? isScrolled
                        ? "bg-white/[0.02] text-black"
                        : "bg-white/[0.02] text-white"
                      : ""
                  )}>
                  <UserIconSvg className="h-5 w-5" />
                  {userInfo.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={clsx(
                    " px-3 py-1.5 hover:opacity-80 rounded-lg text-sm",
                    pathname === "/"
                      ? isScrolled
                        ? "bg-white/[0.02] text-black"
                        : "bg-white/[0.02] text-white"
                      : ""
                  )}>
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                className={clsx(
                  "relative flex items-center text-black hover:opacity-50",
                  pathname === "/"
                    ? isScrolled
                      ? "bg-white/[0.02] text-black"
                      : "bg-white/[0.02] text-white"
                    : ""
                )}>
                <ShoppingCart strokeWidth={2} size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-base rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile toggle (hamburger) */}
              <button
                onClick={handleClick}
                className="ttext-white hover:opacity-50 p-2 rounded-md z-50 ">
                {clicked ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
            {/* Mobile menu drawer */}
            <AnimatePresence>
              {clicked && (
                <motion.nav
                  ref={menuRef}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-gradient-to-tr min-h-screen from-zinc-900 to-zinc-700 fixed inset-0 z-40 text-zinc-50 py-24 px-6 text-lg flex flex-col gap-6">
                  <Link
                    to="/"
                    onClick={() => setClicked(false)}
                    className={clsx(
                      "py-2 border-b border-rose-600",
                      pathname === "/" && "text-rose-400"
                    )}>
                    Home
                  </Link>

                  {/* Mobile Category accordion */}
                  <div>
                    <button
                      onClick={() =>
                        setExpandedMobileCat((prev) => (prev === "all" ? null : "all"))
                      }
                      className="flex items-center hover:opacity-50 gap-2">
                      Categories
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedMobileCat === "all" ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedMobileCat === "all" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 flex flex-col gap-2">
                          {categoryTree?.map((cat) => (
                            <div key={cat._id}>
                              <Link
                                to={`/category/${cat.name}`}
                                onClick={() => setClicked(false)}
                                className="block py-1 hover:text-rose-400">
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                              </Link>
                              {cat.children?.length > 0 && (
                                <ul className="pl-4 text-sm space-y-1">
                                  {cat.children.map((subcat) => (
                                    <li key={subcat._id}>
                                      <Link
                                        to={`/category/${subcat.name}`}
                                        onClick={() => setClicked(false)}
                                        className="hover:opacity-50">
                                        {subcat.name.charAt(0).toUpperCase() + subcat.name.slice(1)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/about"
                    onClick={() => setClicked(false)}
                    className="py-2 hover:opacity-50">
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setClicked(false)}
                    className="py-2 hover:opacity-50">
                    Contact
                  </Link>

                  {/* Search (mobile) */}
                  <div className="relative mt-6 flex flex-col">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchSubmit}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-zinc-900"
                    />
                  </div>

                  {/* Footer inside mobile menu */}
                  <div className="mt-auto text-xs text-zinc-400 text-center">
                    <p>
                      Designed by <span className="font-bold">Webschema</span>
                    </p>
                    <p>&copy; {new Date().getFullYear()} IPSUM Store. All rights reserved.</p>
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
}
