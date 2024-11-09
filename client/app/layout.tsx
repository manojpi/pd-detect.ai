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
      <body className="bg-neutral-900">
        <div className="h-screen w-screen flex flex-col overflow-scroll scrollbar scrollbar-thumb-neutral-700 scrollbar-track-neutral-900" >
          <Header/>
          <BotUI/>
          {children}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
