import "./globals.css";
import { metadata } from "./metadata";
import { Toaster } from "sonner";
import {
  UnifrakturMaguntia,
  Inter_Tight,
  JetBrains_Mono,
  Cinzel_Decorative,
  Grenze_Gotisch,
  DM_Sans,          // ← add this
} from "next/font/google";

export { metadata };

// ─── GLOBAL FONT DECLARATIONS (declared ONCE here, referenced via CSS vars) ───
const blackletter = UnifrakturMaguntia({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-blackletter",
  display: "swap",
});
const inter = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const cinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});
const goth = Grenze_Gotisch({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-goth",
  display: "swap",
});
const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${blackletter.variable} ${inter.variable} ${mono.variable} ${cinzel.variable} ${goth.variable} ${dm.variable}`}
    >
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
