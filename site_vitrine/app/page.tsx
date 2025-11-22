import HeroBlock from "./components/HeroBlock";
import CtaStrip from "./components/CtaStrip";
import KeyFeaturesBlock from "./components/KeyFeaturesBlock";
import PartnersBlock from "./components/PartnersBlock";
import AiBenefitsBlock from "./components/AiBenefitsBlock";

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