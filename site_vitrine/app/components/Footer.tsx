import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#3C3C3C] text-gray-300 px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">

        {/* TOP PART WITH BUTTON */}
        <div className="flex justify-end mb-10">
          <Link
            href="/app"
            className="px-6 py-3 bg-[#FF453A] text-white rounded-lg hover:bg-[#e63c32] transition font-medium"
          >
            Accéder au logiciel
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT : LOGO */}
          <div>
            <img
              src="/assets/LogoOpitigistik2RMBG.png"
              alt="Optigistik Logo"
              className="h-36 w-auto mb-6"
            />

            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                target="_blank"
                className="p-3 border border-gray-500 rounded-full hover:bg-gray-700 transition"
              >
                <img src="/assets/mdi_linkedin.png" className="w-5 h-5" alt="LinkedIn" />
              </a>

              <a
                href="#"
                target="_blank"
                className="p-3 border border-gray-500 rounded-full hover:bg-gray-700 transition"
              >
                <img src="/assets/mdi_youtube.png" className="w-5 h-5" alt="YouTube" />
              </a>
            </div>
          </div>

          {/* CENTER : SITEMAP + CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sitemap</h3>

            <ul className="space-y-2 text-gray-300">
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/features">Fonctionnalités</Link></li>
              <li><Link href="/pricing">Tarifications</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Nous contacter</Link></li>
            </ul>

            <hr className="border-gray-600 my-6 w-1/2" />

            <p className="text-gray-300">+33 4 39 51 11 87</p>
            <a
              href="mailto:contact@optigistik.com"
              className="text-gray-300 underline"
            >
              contact@optigistik.com
            </a>
          </div>

          {/* RIGHT : LEGAL + COPYRIGHT */}
          <div className="flex flex-col justify-between text-sm h-full">

            <div className="flex justify-end gap-6 text-gray-400">
              <Link href="/legal">Mentions légales</Link>
              <Link href="/cgv">CGV</Link>
            </div>

            <div className="text-right text-gray-500 mt-10">
              © 2025 — Optigistik
              <br />
              All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}