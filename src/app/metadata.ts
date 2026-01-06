import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Drixe",
    template: "%s · drixe.lol",
  },

  description:
    "not batman. but the playlist says otherwise.",

  metadataBase: new URL("https://drixe.lol"),

  openGraph: {
    title: "Drixe",
    description:
      "not batman. but the playlist says otherwise.",
    url: "https://drixe.lol",
    siteName: "drixe.lol",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Drixe — unfinished but online",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Drixe",
    description:
      "shipping vibes. ignoring bugs. pretending it’s intentional.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  themeColor: "#000000",
};
