import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indian Wedding Invitation | Experience a Real Indian Wedding",

  description:
    "Experience India through a real Indian wedding. Discover authentic Indian wedding celebrations, meet Indian families, explore traditions, food, music and culture, and celebrate as a guest.",

  keywords: [
    "Indian wedding",
    "real Indian wedding",
    "Indian wedding experience",
    "Indian wedding invitation",
    "Indian wedding guest",
    "attend an Indian wedding",
    "Indian wedding celebrations",
    "Indian wedding traditions",
    "Indian wedding culture",
    "Indian wedding experiences",
    "weddings in India",
    "Indian wedding tourism",
    "Indian wedding travel",
    "experience India",
    "Indian cultural experiences",
    "international guests Indian wedding",
    "authentic Indian wedding",
    "discover Indian weddings",
  ],

  openGraph: {
    title: "Indian Wedding Invitation | Experience a Real Indian Wedding",
    description:
      "Experience India through a real Indian wedding. Discover authentic Indian wedding celebrations, meet Indian families, explore traditions, food, music and culture, and celebrate as a guest.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Indian Wedding Invitation | Experience a Real Indian Wedding",
    description:
      "Experience India through a real Indian wedding. Discover authentic Indian wedding celebrations, meet Indian families, explore traditions, food, music and culture, and celebrate as a guest.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
