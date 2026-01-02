import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { InteractiveBackground } from '../InteractiveBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <InteractiveBackground />
      <div className="relative z-10">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};