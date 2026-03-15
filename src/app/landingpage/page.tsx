"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroBlock } from "@/components/landing/HeroBlock";
import { IdentificationBlock } from "@/components/landing/IdentificationBlock";
import { StoryBlock } from "@/components/landing/StoryBlock";
import { ThreeSilencesBlock } from "@/components/landing/ThreeSilencesBlock";
import { AntidoteBlock } from "@/components/landing/AntidoteBlock";
import { LevelsBlock } from "@/components/landing/LevelsBlock";
import { PreviewBlock } from "@/components/landing/PreviewBlock";
import { PricingBlock } from "@/components/landing/PricingBlock";
import { BonusBlock } from "@/components/landing/BonusBlock";
import { GuaranteeBlock } from "@/components/landing/GuaranteeBlock";
import { FAQBlock } from "@/components/landing/FAQBlock";
import { ClosingBlock } from "@/components/landing/ClosingBlock";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* Block 0: Header */}
      <LandingHeader />

      {/* Dividers between sections */}
      <Divider />

      {/* Block 1: Hero / Gancho */}
      <HeroBlock />

      <Divider />

      {/* Block 2: Identificacion */}
      <IdentificationBlock />

      <Divider />

      {/* Block 3: Micro-historia */}
      <StoryBlock />

      <Divider />

      {/* Block 4: Regla de los 3 Silencios */}
      <ThreeSilencesBlock />

      <Divider />

      {/* Block 5: Antidoto - Corazon de la oferta */}
      <AntidoteBlock />

      <Divider />

      {/* Block 6: Los 4 Niveles */}
      <LevelsBlock />

      <Divider />

      {/* Block 7: Preview del sistema */}
      <PreviewBlock />

      <Divider />

      {/* Block 8: Precio + CTA */}
      <PricingBlock />

      <Divider />

      {/* Block 9: Bonos */}
      <BonusBlock />

      <Divider />

      {/* Block 10: Garantia */}
      <GuaranteeBlock />

      <Divider />

      {/* Block 11: FAQ */}
      <FAQBlock />

      <Divider />

      {/* Block 12: Cierre definitivo */}
      <ClosingBlock />
    </main>
  );
}

function Divider() {
  return (
    <div className="flex justify-center py-2">
      <div
        className="w-16 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)",
        }}
      />
    </div>
  );
}
