import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "AI智能平台",
  description: "AI智能平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header */}
          <header className="fixed top-0 left-0 w-full bg-white shadow z-50 h-16 flex items-center">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="text-lg font-semibold">智能小客服</div>
            </div>
          </header>

          {/* 占位高度 */}
          <div className="h-16" />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto px-4 pb-20">
            <div className="container mx-auto">{children}</div>
          </main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 w-full bg-white shadow z-50 h-16 flex items-center">
            <div className="container px-4 flex justify-center">
              <div className="text-sm text-gray-600">© 2025 My App</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
