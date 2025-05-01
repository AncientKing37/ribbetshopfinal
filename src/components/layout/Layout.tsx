import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { setPageTitle } from '@/utils/title';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  useEffect(() => {
    setPageTitle(title);
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
