import Navbar from "./components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";
import AuthProvider from "../utils/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediMitra",
  description: "Your personalized healthcare companion.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
