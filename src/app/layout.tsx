import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { OnlineStatusProvider } from "@/components/pwa/OnlineStatusProvider";

export const metadata: Metadata = {
  title: "No Mas Migajas",
  description: "Tu camino hacia la recuperacion emocional",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "No Mas Migajas",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && !window.__swFixed) {
                window.__swFixed = true;
                caches.keys().then(function(names) {
                  var hasOld = names.some(function(n) { return n.indexOf('v1') !== -1 || n.indexOf('v2') !== -1 || n.indexOf('v3') !== -1; });
                  if (hasOld) {
                    Promise.all(names.map(function(n) { return caches.delete(n); })).then(function() {
                      navigator.serviceWorker.getRegistrations().then(function(regs) {
                        Promise.all(regs.map(function(r) { return r.unregister(); })).then(function() {
                          window.location.reload();
                        });
                      });
                    });
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <OnlineStatusProvider>
          <ServiceWorkerRegistration />
          {children}
        </OnlineStatusProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
