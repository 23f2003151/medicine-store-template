import "./globals.css";
import { template } from "@/lib/template";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={template.store.locale}>
      <body>{children}</body>
    </html>
  );
}
