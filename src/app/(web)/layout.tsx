import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import '../index.css'
export default function WedbLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </div>
  );
}
