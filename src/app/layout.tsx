import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

export const metadata: Metadata = {
  title: "System Administrator",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">  
      <body>
        <div className="flex flex-col gap-4 h-screen p-4">
            <Navbar/>
            <div className="flex gap-4 flex-grow">
                <Sidebar />
                <main className="flex-grow">{children}</main>
            </div>
        </div>
        </body>
    </html>
  );
}
