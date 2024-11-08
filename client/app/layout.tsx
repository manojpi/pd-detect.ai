import Footer from "@/components/layout/Footer";
import "./globals.css";
import Header from "@/components/layout/Header";
import BotUI from "@/components/layout/BotUI";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen w-screen flex flex-col">
          <Header/>
          <BotUI/>
          {children}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
