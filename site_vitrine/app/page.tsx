import HeroBlock from "./components/HeroBlock";
import CtaStrip from "./components/CtaStrip";
import KeyFeaturesBlock from "./components/KeyFeaturesBlock";
import PartnersBlock from "./components/PartnersBlock";
import AiBenefitsBlock from "./components/AiBenefitsBlock";
import SmartOptimizationBlock from "./components/SmartOptimizationBlock";
import ValueAddedBlock from "./components/ValueAddedBlock";
import PricingBlock from "./components/PricingBlock";
import ContactBlock from "./components/ContactBlock";

export default function HomePage() {
  return (
    <div className="pt-24"> {/* marge sous la navbar fixe */}
      <HeroBlock />
      <AiBenefitsBlock />
      <KeyFeaturesBlock />
      <PartnersBlock />
      <CtaStrip />
    </div>
  );
}