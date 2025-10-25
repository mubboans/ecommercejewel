import { Header } from './header';
import { Footer } from './footer';
import { PromoBanner } from '../headers/promo-banner';
import { MarqueeBanner } from '../headers/marquee-banner';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col flex-grow w-full">
      <Header />
      <PromoBanner />
      <MarqueeBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}