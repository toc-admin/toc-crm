import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Office Company - CRM",
  description: "Internal CRM for managing furniture catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=manrope@400,500,600,700,800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Manrope, sans-serif' }}>{children}</body>
    </html>
  );
}
