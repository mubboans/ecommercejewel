'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { CartProvider } from './cart-provider';
import { Toaster } from "sonner";
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartProvider>
          <Toaster position="top-center" richColors expand duration={4000} />
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}