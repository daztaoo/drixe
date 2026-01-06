import "./globals.css";
import { metadata } from "./metadata";
import ClientGuard from "./ClientGuard";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientGuard>
          {children}
        </ClientGuard>
      </body>
    </html>
  );
}
