import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "No Mas Migajas™ — Software de Rescate Emocional",
  description:
    "El test de 60 segundos que destruye la mentira que te repites cada noche. Descubre tu Indice de Migajas y deja de mendigar atencion.",
  openGraph: {
    title: "No Mas Migajas™ — Software de Rescate Emocional",
    description:
      "Mas de 12,400 mujeres ya descubrieron su Indice de Migajas™. Hoy es tu turno.",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070709] text-white antialiased">
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1662990398038476');
          fbq('track', 'PageView');
          fbq('track', 'ViewContent');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1662990398038476&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {children}
    </div>
  );
}
