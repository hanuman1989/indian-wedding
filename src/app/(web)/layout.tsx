import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/app/providers/StoreProvider";
import '../index.css'
export default function WedbLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <StoreProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </StoreProvider>
  );
}
