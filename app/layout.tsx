import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "BuildMyStore",
  description: "Launch a ready-to-customize Shopify store."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta {...({ name: "impact-site-verification", value: "24ba8635-171c-4be3-a032-7a097a9dc56d" } as Record<string, string>)} />
      </head>
      <body>{children}</body>
    </html>
  );
}
