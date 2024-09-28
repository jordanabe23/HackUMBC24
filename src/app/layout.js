// app/layout.js
'use client';

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthorized(!!token);

      // Redirect if not authorized
      if (!token && pathname !== '/login' && pathname !== '/register') {
        router.push('/register');
      }
    };

    // Check auth status initially
    checkAuth();

    // Set up event listener for storage changes
    const storageListener = () => checkAuth();
    window.addEventListener('storage', storageListener);

    // Clean up event listener
    return () => window.removeEventListener('storage', storageListener);
  }, [router, pathname]);

  // Custom event listener for login
  useEffect(() => {
    const handleLogin = () => {
      setIsAuthorized(true);
    };

    window.addEventListener('login', handleLogin);

    // Clean up event listener
    return () => window.removeEventListener('login', handleLogin);
  }, []);

  return (
    <html lang="en">
      <body className="flex">
        {isAuthorized && <Sidebar />}
        <main className="flex-1 bg-slate-50 min-h-screen p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
