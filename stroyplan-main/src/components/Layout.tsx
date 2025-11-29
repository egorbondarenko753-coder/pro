import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showNavbar?: boolean;
}

export const Layout = ({ children, showFooter = true, showNavbar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
