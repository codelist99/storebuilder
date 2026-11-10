import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "BuildMyStore",
  description: "Launch a ready-to-customize Shopify store."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
