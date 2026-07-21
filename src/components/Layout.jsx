import { useState } from "react";
import Header from "./Header";
import SideNav from "./SideNav";
import Footer from "./Footer";

export default function Layout({ children, activeCategory, onCategoryChange, hideSideNav }) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  if (hideSideNav) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <Header />
        <main className="pt-16 flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header onMenuToggle={() => setSideNavOpen(!sideNavOpen)} />
      <div className="flex pt-16 flex-1">
        <SideNav
          isOpen={sideNavOpen}
          onClose={() => setSideNavOpen(false)}
          activeCategory={activeCategory || "All"}
          onCategoryChange={onCategoryChange || (() => {})}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
