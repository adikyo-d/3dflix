import Navbar from "./components/layout/Navbar";
import Providers from "./components/Providers";
import "./globals.css";

export const metadata = {
  title: "3DFLIX",
  description: "Project Pemrograman Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
      </head>
      <body className="bg-[#14181c] text-white min-h-screen">
        <Providers>
          <Navbar/>
          {children}
        </Providers>
      </body>
    </html>
  );
}