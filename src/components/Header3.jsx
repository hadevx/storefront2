import { ShoppingCart, Menu, X, User as UserIconSvg, ChevronDown, Globe } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { useGetCategoriesTreeQuery, useGetProductsQuery } from "../redux/queries/productApi";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";
import { toggleLang } from "../redux/slices/languageSlice";

export default function Header({ onSearch }) {
  const dispatch = useDispatch();

  // ✅ language from redux
  const language = useSelector((state) => state.language.lang);

  const t = useMemo(() => {
    return language === "ar"
      ? {
          home: "الرئيسية",
          categories: "الفئات",
          about: "من نحن",
          contact: "تواصل معنا",
          login: "تسجيل الدخول",
          myAccount: "حسابي",
          close: "إغلاق",
          browseCategories: "تصفح الفئات",
          browseHint: "استكشف مجموعات مختارة لك.",
          tip: "نصيحة: استخدم البحث للعثور على المنتجات بسرعة",
          viewAllProducts: "عرض كل المنتجات →",
          menu: "القائمة",
          switchTo: "English",
          logo: "WebSchema",
        }
      : {
          home: "Home",
          categories: "Categories",
          about: "About",
          contact: "Contact",
          login: "Login",
          myAccount: "My account",
          close: "Close",
          browseCategories: "Browse categories",
          browseHint: "Explore collections curated for you.",
          tip: "Tip: Use search to find items fast",
          viewAllProducts: "View all products →",
          menu: "Menu",
          switchTo: "العربية",
          logo: "WebSchema",
        };
  }, [language]);

  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noProductFound, setNoProductFound] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  const { data: products = [] } = useGetProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const cartCount = useMemo(() => cartItems.reduce((a, c) => a + c.qty, 0), [cartItems]);

  const menuRef = useRef(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClicked(false);
        setExpandedCategoryId(null);
        setExpandedMobileCat(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // lock scroll when mobile menu open
  useEffect(() => {
    if (clicked) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [clicked]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setNoProductFound(false);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchQuery.trim().toLowerCase();
      const matchedProduct = products.find((p) => p?.name?.toLowerCase().includes(q));
      if (matchedProduct) {
        navigate(`/products/${matchedProduct._id}`);
        setClicked(false);
        setNoProductFound(false);
        setExpandedMobileCat(null);
      } else {
        setNoProductFound(true);
      }
    }
  };

  // scroll styles
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 14);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  // Desktop mega menu rendering
  const renderCategoryTree = (categories) =>
    categories?.map((cat) => (
      <div key={cat._id} className="space-y-2">
        <Link
          to={`/category/${cat._id}`}
          onClick={() => setExpandedCategoryId(null)}
          className="block text-sm font-semibold text-neutral-900 hover:text-neutral-700">
          {cap(cat.name)}
        </Link>
        {cat.children?.length > 0 && (
          <ul className="space-y-1 pl-3 border-l border-neutral-200">
            {cat.children.map((child) => (
              <li key={child._id}>
                <Link
                  to={`/category/${child._id}`}
                  onClick={() => setExpandedCategoryId(null)}
                  className="block text-sm text-neutral-600 hover:text-neutral-900">
                  {cap(child.name)}
                </Link>
                {child.children?.length > 0 && (
                  <ul className="mt-1 space-y-1 pl-3">
                    {child.children.map((g) => (
                      <li key={g._id}>
                        <Link
                          to={`/category/${g._id}`}
                          onClick={() => setExpandedCategoryId(null)}
                          className="block text-xs text-neutral-500 hover:text-neutral-900">
                          {cap(g.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));

  // Mobile category tree
  const renderMobileCategoryTree = (categories) =>
    categories?.map((cat) => (
      <div key={cat._id} className="space-y-2">
        <Link
          to={`/category/${cat._id}`}
          onClick={() => {
            setClicked(false);
            setExpandedMobileCat(null);
          }}
          className="block rounded-2xl px-4 py-3 text-sm font-semibold text-white/95 hover:bg-white/10">
          {cap(cat.name)}
        </Link>

        {cat.children?.length > 0 && (
          <div className="pl-3 space-y-1">
            {cat.children.map((child) => (
              <Link
                key={child._id}
                to={`/category/${child._id}`}
                onClick={() => {
                  setClicked(false);
                  setExpandedMobileCat(null);
                }}
                className="block rounded-2xl px-4 py-2 text-sm text-white/80 hover:bg-white/10">
                {cap(child.name)}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));

  const isMenuOpen = clicked;

  return (
    <>
      <motion.header
        dir={language === "ar" ? "rtl" : "ltr"}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 px-2 md:px-0 py-2 sm:py-0",
          "transition-all duration-300",
          isMenuOpen
            ? "bg-black text-white border-b border-white/10"
            : isScrolled
              ? "backdrop-blur-sm bg-white/70 border-b border-neutral-200 text-neutral-900"
              : "bg-transparent",
          pathname === "/" && !isScrolled && !isMenuOpen ? "text-white" : "",
        )}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}>
        {/* Store banner */}
        {storeStatus?.[0]?.banner?.trim() && (
          <div className="bg-neutral-950 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold">
            {storeStatus[0].banner}
          </div>
        )}

        <div className="container-custom h-14 md:h-16 flex items-center justify-between px-2 md:px-10">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base md:text-lg font-semibold tracking-tight">{t.logo}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-sm font-medium hover:opacity-70">
              {t.home}
            </Link>

            {/* Categories mega */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setExpandedCategoryId((p) => (p === "all" ? null : "all"))}
                className="text-sm font-medium hover:opacity-70 inline-flex items-center gap-1">
                {t.categories}
                <ChevronDown
                  size={16}
                  className={clsx(
                    "transition-transform duration-200",
                    expandedCategoryId === "all" ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              <AnimatePresence>
                {expandedCategoryId === "all" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 12, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={clsx(
                      "absolute top-full w-[760px] rounded-3xl border border-neutral-200 bg-white shadow-2xl overflow-hidden",
                      language === "ar" ? "right-0" : "left-0",
                    )}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {t.browseCategories}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">{t.browseHint}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedCategoryId(null)}
                          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50">
                          {t.close}
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-6">
                        {categoryTree && renderCategoryTree(categoryTree)}
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">{t.tip}</span>
                      <Link
                        to="/all-products"
                        onClick={() => setExpandedCategoryId(null)}
                        className="text-xs font-semibold text-neutral-900 hover:opacity-70">
                        {t.viewAllProducts}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="text-sm font-medium hover:opacity-70">
              {t.about}
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:opacity-70">
              {t.contact}
            </Link>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* ✅ Lang toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleLang())}
              className={clsx(
                "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition",
                pathname === "/" && !isScrolled
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
              )}>
              <Globe className="h-4 w-4" />
              <span>{t.switchTo}</span>
            </button>

            {userInfo ? (
              <Link
                to="/profile"
                className={clsx(
                  "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition",
                  pathname === "/" && !isScrolled
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                    : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
                )}>
                <UserIconSvg className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{userInfo.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={clsx(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition",
                  pathname === "/" && !isScrolled
                    ? "bg-white text-neutral-900 hover:bg-white/90"
                    : "bg-neutral-950 text-white hover:bg-neutral-900",
                )}>
                {t.login}
              </Link>
            )}

            <Link
              to="/cart"
              className={clsx(
                "relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                pathname === "/" && !isScrolled
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
              )}
              aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-xs font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              className={clsx(
                "relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                pathname === "/" && !isScrolled
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-neutral-200 bg-white text-neutral-900",
              )}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-xs font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ✅ Mobile lang toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleLang())}
              className={clsx(
                "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border px-3 transition",
                pathname === "/" && !isScrolled
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-neutral-200 bg-white text-neutral-900",
              )}>
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{t.switchTo}</span>
            </button>

            <button
              type="button"
              onClick={() => setClicked((p) => !p)}
              className={clsx(
                "relative inline-flex items-center gap-2 h-10 px-4 rounded-2xl border transition",
                "bg-black text-white shadow-[0_1px_15px_rgba(0,0,0,0.5)] border-white/20 hover:border-white/30",
                "active:scale-[0.98]",
              )}
              aria-label="Menu">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-red-500 to-orange-400" />
              <span className="text-sm font-medium">{t.menu}</span>
              {clicked ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Fullscreen Mobile menu */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[60]">
              <div className="absolute inset-0 bg-black" />

              <motion.nav
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="relative h-full w-full text-white"
                dir={language === "ar" ? "rtl" : "ltr"}>
                {/* top bar */}
                <div className="px-5 pt-5 pb-4 border-b border-white/10 flex items-center justify-between">
                  <Link
                    to="/"
                    onClick={() => {
                      setClicked(false);
                      setExpandedMobileCat(null);
                    }}
                    className="font-semibold">
                    {t.logo}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setClicked(false);
                      setExpandedMobileCat(null);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 hover:bg-white/10"
                    aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-5 py-5 space-y-4">
                  <Link
                    to="/"
                    onClick={() => setClicked(false)}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                    {t.home}
                  </Link>

                  {/* Categories accordion */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedMobileCat((p) => (p === "all" ? null : "all"))}
                      className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold">
                      {t.categories}
                      <ChevronDown
                        size={18}
                        className={clsx(
                          "transition-transform",
                          expandedMobileCat === "all" ? "rotate-180" : "rotate-0",
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedMobileCat === "all" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-2 pb-3">
                          <div className="max-h-[55vh] overflow-y-auto pr-2 space-y-2">
                            {categoryTree && renderMobileCategoryTree(categoryTree)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/about"
                    onClick={() => setClicked(false)}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                    {t.about}
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setClicked(false)}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                    {t.contact}
                  </Link>

                  {userInfo ? (
                    <Link
                      to="/profile"
                      onClick={() => setClicked(false)}
                      className="mt-2 inline-flex w-full items-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-semibold hover:bg-white/90">
                      <UserIconSvg className="h-4 w-4" />
                      {t.myAccount}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setClicked(false)}
                      className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-semibold hover:bg-white/90">
                      {t.login}
                    </Link>
                  )}

                  <div className="pt-6 text-center text-xs text-white/50">
                    © {new Date().getFullYear()} {t.logo}
                  </div>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
