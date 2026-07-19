import { useState } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

export default function Layout({ children, activeCategory, onCategoryChange, hideSideNav }) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  if (hideSideNav) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header onMenuToggle={() => setSideNavOpen(!sideNavOpen)} />
      <div className="flex pt-16">
        <SideNav
          isOpen={sideNavOpen}
          onClose={() => setSideNavOpen(false)}
          activeCategory={activeCategory || "All"}
          onCategoryChange={onCategoryChange || (() => {})}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
