import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Drixe",
    template: "%s · drixe.lol",
  },

  description:
    "mentally present. spiritually somewhere else. — a personal internet artifact by Drixe.",

  metadataBase: new URL("https://drixe.lol"),

  openGraph: {
    title: "Drixe",
    description:
      "thinking in lowercase. nothing urgent. everything intentional.",
    url: "https://drixe.lol",
    siteName: "drixe.lol",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Drixe — personal internet artifact",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Drixe",
    description:
      "existing between playlists. built late. deployed later.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  themeColor: "#000000",
};
