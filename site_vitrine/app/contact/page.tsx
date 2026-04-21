import ContactBlock from "../components/ContactBlock";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300"> {/* marge sous la navbar fixe */}
            <ContactBlock />
        </div>
    );
}