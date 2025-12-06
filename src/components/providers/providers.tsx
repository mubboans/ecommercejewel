'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { CartProvider } from './cart-provider';
import { Toaster } from "sonner";
import AuthSessionProvider from './session-provider';
import { NavigationProgress } from './navigation-progress';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NavigationProgress />
        <CartProvider>
          <Toaster position="bottom-right" richColors expand duration={3000} />
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  );
}