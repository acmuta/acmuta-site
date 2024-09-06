import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ACM UTA",
  description: "ACM UTA Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(3350px_4000px_at_4%_50%,_var(--tw-gradient-stops))] from-[#14a2d5] from-0% via-[#0a6aa5] via-25%  to-[#011e38] to-100% flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}