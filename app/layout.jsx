import "./globals.css";

export const metadata = {
  title: "MAFIANA Tech Academy | Computer, Data, Marketing, Design and Web Development",
  description:
    "Learn computer basics, data analytics, digital marketing, graphic design and web development in class or online. Pay in installments and get a certificate.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
