import Logo, { AbberBrandText } from "../../../components/common/Logo";

const Footer = () => {

    return (

        <footer className="bg-slate-900 text-slate-300">

            <div className="mx-auto grid max-w-7xl gap-16 px-8 py-24 lg:grid-cols-4">

                <div>

                    <div className="flex items-center gap-3">
              <Logo size="sm" />
              <AbberBrandText size="md" />
            </div>

                    <p className="mt-8 text-lg leading-8 text-slate-400 max-w-sm">

                        Building the next generation of innovators,
                        entrepreneurs and mentors across Africa.

                    </p>

                </div>

                <div>

                    <h3 className="mb-6 text-lg text-white font-bold">

                        Platform

                    </h3>

                    <ul className="space-y-4 text-base">

                        <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Mentorship</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Community</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Dashboard</li>

                    </ul>

                </div>

                <div>

                    <h3 className="mb-6 text-lg text-white font-bold">

                        Resources

                    </h3>

                    <ul className="space-y-4 text-base">

                        <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Contact</li>

                    </ul>

                </div>

                <div>

                    <h3 className="mb-6 text-lg text-white font-bold">

                        Legal

                    </h3>

                    <ul className="space-y-4 text-base">

                        <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Cookies</li>

                    </ul>

                </div>

            </div>

            <div className="border-t border-slate-700 py-8 text-center text-base">

                <p>© 2026 Abber. All rights reserved. <span className="text-slate-500">— Make it real.</span></p>

            </div>

        </footer>

    );

};

export default Footer;
