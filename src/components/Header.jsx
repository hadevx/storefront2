import { ShoppingBasket, Menu, X, ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import UserIcon from "./UserIcon";
import { useGetCategoriesTreeQuery } from "../redux/queries/productApi";
import clsx from "clsx";
import logo from "/images/logo.svg";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

function CategoryDropdown({ category, level = 0, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const hasChildren = category.children && category.children.length > 0;
  const encodedCategory = encodeURIComponent(category.name);
  const categoryPath = `/category/${encodedCategory}`;

  const toggleOpen = () => {
    setIsOpen((v) => !v);
  };

  return (
    <div className={clsx("relative select-none", level > 0 && "ml-6")}>
      <div
        onClick={hasChildren ? toggleOpen : closeMenu}
        className={clsx(
          "flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md justify-between hover:bg-zinc-800",
          pathname === categoryPath && "border-b-2 border-rose-500"
        )}>
        {hasChildren && (
          <ChevronLeft
            size={20}
            className={clsx(
              "text-rose-400 transition-transform duration-300",
              isOpen ? "rotate-90" : "rotate-0"
            )}
          />
        )}
        <Link
          to={categoryPath}
          className="flex-grow"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}>
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </Link>
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="mt-1 bg-zinc-800/95 backdrop-blur-md rounded-lg shadow-lg min-w-[180px] py-2 z-50">
            {category.children.map((sub) => (
              <CategoryDropdown
                key={sub._id}
                category={sub}
                level={level + 1}
                closeMenu={closeMenu}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header() {
  const [clicked, setClicked] = useState(false);
  const { pathname } = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const menuRef = useRef();

  const { data: storeStatus, refetch, isLoading } = useGetStoreStatusQuery();

  const handleClick = () => {
    setClicked(!clicked);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClicked(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (clicked) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [clicked]);

  return (
    <>
      {/* Banner on top if available */}
      {storeStatus?.[0]?.banner?.trim() && (
        <div className="bg-black text-white text-center py-2 px-4 text-sm lg:text-base font-semibold">
          {storeStatus[0].banner}
        </div>
      )}

      <div className="flex justify-around py-5 px-2 bg-white sticky top-0 z-50">
        <div className="w-[60%]">
          <Link to="/">
            <img src={logo} alt="logo" className="h-10" />
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-end">
          <UserIcon userInfo={userInfo} />
          <div className="relative w-[50px] cursor-pointer hover:bg-zinc-100 p-1 rounded-lg drop-shadow-lg transition-all delay-75">
            <Link to="/cart">
              <div>
                <ShoppingBasket strokeWidth={1} size={36} />
              </div>
              <span
                key={cartItems.reduce((a, c) => a + c.qty, 0)}
                className="absolute drop-shadow-lg top-0 right-0 text-sm bg-gradient-to-r from-rose-500/90 to-rose-600 font-bold text-white px-2 rounded-full">
                {Number(cartItems.reduce((a, c) => a + c.qty, 0))}
              </span>
            </Link>
          </div>
          {!clicked ? (
            <p
              className="cursor-pointer z-20 hover:bg-zinc-100 p-1 rounded-lg drop-shadow-lg"
              onClick={handleClick}
              aria-label="Open menu">
              <Menu size={30} />
            </p>
          ) : (
            <p
              className="cursor-pointer z-50 bg-zinc-100 p-1 rounded-lg drop-shadow-lg"
              onClick={handleClick}
              aria-label="Close menu">
              <X size={30} />
            </p>
          )}

          <AnimatePresence>
            {clicked && (
              <motion.nav
                ref={menuRef}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                variants={{
                  hidden: { x: -10, opacity: 0 },
                  visible: { x: 0, opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                className="bg-gradient-to-tr overflow-y-scroll from-zinc-900 to-zinc-700 shadow-2xl inset-0 lg:top-0 lg:left-auto lg:bottom-0 lg:right-0 text-zinc-50 font-semibold py-32 text-3xl items-center lg:w-[500px] fixed z-40 gap-10 flex flex-col">
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className={clsx(
                    pathname === "/" &&
                      "border-b-2 py-1 hover:text-zinc-50/70 transition-all delay-75 ease-out border-rose-500"
                  )}>
                  <Link to="/">Home</Link>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className={clsx(
                    "hover:text-zinc-50/70 transition-all delay-75 ease-out",
                    pathname === "/cart" && "border-b-2 py-1 border-rose-500"
                  )}>
                  <Link to="/cart">
                    Cart{" "}
                    <span className="text-sm">({cartItems.reduce((a, c) => a + c.qty, 0)})</span>
                  </Link>
                </motion.div>

                {/* Recursive categories dropdown */}
                {categoryTree?.map((category) => (
                  <CategoryDropdown
                    key={category._id}
                    category={category}
                    closeMenu={() => setClicked(false)}
                  />
                ))}

                <div className="flex z-50 text-xs justify-center items-center">
                  <div className="flex text-gray-300 flex-col items-center select-none">
                    <h1 className="font-semibold">IPSUM</h1>
                    <div className="text-gray-300 flex gap-2 items-center">
                      Designed by <Link className="font-bold font-mono">Webschema</Link>
                    </div>
                    <div className="text-gray-300">
                      &copy; {new Date().getFullYear()} IPSUM Store. All rights reserved.
                    </div>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Header;
