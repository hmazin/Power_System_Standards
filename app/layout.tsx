import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Power System Standards Registry",
    template: "%s | Power System Standards Registry"
  },
  description:
    "A public metadata registry for electrical and power-system standards used in Canada and the United States.",
  openGraph: {
    title: "Power System Standards Registry",
    description:
      "Search public metadata for electrical and power-system standards across Canada, the United States, and North America.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
