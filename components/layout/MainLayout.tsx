import Navbar from './Navbar';
import Footer from './Footer';
import { ReactNode } from 'react';
import AccessibilityReport from '@/components/ui/AccessibilityReport';

interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
      <div className="fixed bottom-4 right-4 z-50">
        <AccessibilityReport />
      </div>
    </div>
  );
}