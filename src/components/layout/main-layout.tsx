import { Header } from './header';
import { Footer } from './footer';
import { DynamicBanner } from '../headers/dynamic-banner';

interface MainLayoutProps {
  children: React.ReactNode;
  banners?: Array<{
    _id: string;
    message: string;
    bgColor: string;
    textColor: string;
    link?: string;
  }>;
}

export function MainLayout({ children, banners = [] }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col flex-grow w-full">
      <Header />
      {banners.length > 0 && <DynamicBanner banners={banners} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}