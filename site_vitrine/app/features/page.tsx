import FeaturesBannerBlock from "../components/FeaturesBannerBlock";
import RealTimeTrackingBlock from "../components/RealTimeTrackingBlock";
import OperationalManagementBlock from "../components/OperationalManagementBlock";
import SmartOptimizationBlock from "../components/SmartOptimizationBlock";
import ValueAddedBlock from "../components/ValueAddedBlock";
import CtaStrip from "../components/CtaStrip";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <FeaturesBannerBlock />
            <OperationalManagementBlock />
            <SmartOptimizationBlock />
            <RealTimeTrackingBlock />
            <ValueAddedBlock />
            <CtaStrip className="bg-white" />
        </div>
    );
}
