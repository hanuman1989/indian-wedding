"use client"

import { Provider } from 'react-redux';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import store from '@/store/store';
import '../index.css'
export default function WedbLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Provider store={store}>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </Provider>
  );
}
