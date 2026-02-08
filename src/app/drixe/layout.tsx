import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Drixe ",
  description:
    "Personal profile of Drixe. Founder of drixe.lol. Live presence, Spotify integration, Discord activity, and digital identity architecture.",
};

export default function DrixeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
