
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FlagRush",
  description: "Dashboard",
};

function Header() {
  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-white border-b shadow-sm">
      <img src="/flagrushlogo.png" alt="FlagRush Logo" className="h-12 w-auto" />
      <span className="text-2xl font-bold tracking-tight text-blue-900">FlagRush</span>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
