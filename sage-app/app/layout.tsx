import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sage Mode — Radiant Liberty",
  description:
    "Discover the exact mental pattern holding you back — and the Sage shift that sets you free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
