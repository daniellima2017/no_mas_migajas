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
import { MiniCTA } from "@/components/landing/MiniCTA";
import { SimulatorMockup } from "@/components/landing/SimulatorMockup";
import { DashboardMockup } from "@/components/landing/DashboardMockup";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* Header: Logo */}
      <LandingHeader />

      <Divider />

      {/* Block 1: Hero / Gancho */}
      <HeroBlock />

      <Divider />

      {/* Block 2: Identificacion */}
      <IdentificationBlock />

      {/* CTA after identification - she just recognized herself */}
      <MiniCTA />

      <Divider />

      {/* Block 3: Micro-historia */}
      <StoryBlock />

      <Divider />

      {/* Block 4: Regla de los 3 Silencios */}
      <ThreeSilencesBlock />

      {/* CTA after emotional impact */}
      <MiniCTA />

      <Divider />

      {/* Block 5: Antidoto - Features */}
      <AntidoteBlock />

      {/* VISUAL: Simulator mockup in action */}
      <SimulatorMockup />

      {/* CTA after seeing the simulator */}
      <MiniCTA />

      <Divider />

      {/* Block 6: Los 4 Niveles */}
      <LevelsBlock />

      <Divider />

      {/* Block 7: Preview del sistema (gauge) */}
      <PreviewBlock />

      {/* VISUAL: Dashboard mockup live */}
      <DashboardMockup />

      {/* CTA after seeing app previews */}
      <MiniCTA />

      <Divider />

      {/* Block 8: Precio + CTA principal */}
      <PricingBlock />

      <Divider />

      {/* Block 9: Bonos */}
      <BonusBlock />

      {/* CTA after bonuses */}
      <MiniCTA />

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
