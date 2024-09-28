import localFont from "next/font/local";
import "./globals.css";
import Sidebar from '../components/Sidebar';

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

export const metadata = {
  title: "Plant Sync",
  description: "HackUMBC2024",
  icons: {
    icon: "/plant.svg",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/plant.svg" />
      </head>
      <body className="flex">
        <Sidebar />
        <main className="flex-1 bg-slate-50 min-h-screen p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
