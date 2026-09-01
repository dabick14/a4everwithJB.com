import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://a4everwithJB.com"),
  title: "Jeremy & Afriyie | Save the Date",
  description:
    "Jeremy and Afriyie are getting married. White wedding: 2nd January 2027, Anagkazo Campus, Mampong.",
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon.png", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://a4everwithJB.com/",
    title: "Jeremy & Afriyie | Save the Date",
    description:
      "White wedding: 2nd January 2027. Anagkazo Campus, Mampong. #JBGetsAnA",
    images: [
      {
        url: "https://a4everwithJB.com/assets/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeremy & Afriyie | Save the Date",
    description: "White wedding: 2nd January 2027. Anagkazo Campus, Mampong.",
    images: ["https://a4everwithJB.com/assets/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#120C06",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        {children}
        <Script defer src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
