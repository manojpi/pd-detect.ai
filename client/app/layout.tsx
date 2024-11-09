import Footer from "@/components/common/Footer";
import "./globals.css";
import Header from "@/components/common/Header";
import BotUI from "@/components/common/BotUI";

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
