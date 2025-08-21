import Header from "./components/Header";
import Footer from "./components/Footer";
import clsx from "clsx";
import Header3 from "./components/Header3";

function Layout({ children, className }) {
  return (
    <div className={clsx("font-[Manrope] ", className && className)}>
      <Header3 />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
