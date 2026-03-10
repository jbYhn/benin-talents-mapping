import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talents de la Diaspora Béninoise",
  description: "Cartographie interactive des talents et compétences de la diaspora béninoise dans le monde.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
