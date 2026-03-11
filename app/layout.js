export const metadata = { title: "Diaspora Béninoise", description: "Carte des talents béninois" };
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
