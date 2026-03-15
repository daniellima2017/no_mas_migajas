import type { Metadata } from "next";
import { Michroma, Inter, JetBrains_Mono } from "next/font/google";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <div
      className={`${michroma.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#070709] text-white antialiased`}
    >
      {children}
    </div>
  );
}
