import { Link } from "react-router-dom";
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

                        <li>
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                        </li>
                        <li>
                            <a href="#mentors" className="hover:text-white transition-colors">Mentorship</a>
                        </li>
                        <li>
                            <a href="#journey" className="hover:text-white transition-colors">Community</a>
                        </li>
                        <li>
                            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        </li>

                    </ul>

                </div>

                <div>

                    <h3 className="mb-6 text-lg text-white font-bold">

                        Resources

                    </h3>

                    <ul className="space-y-4 text-base">

                        <li>
                            <a href="#journey" className="hover:text-white transition-colors">Blog</a>
                        </li>
                        <li>
                            <a href="#features" className="hover:text-white transition-colors">Help Center</a>
                        </li>
                        <li>
                            <a href="#mentors" className="hover:text-white transition-colors">Documentation</a>
                        </li>
                        <li>
                            <Link to="/register" className="hover:text-white transition-colors">Contact</Link>
                        </li>

                    </ul>

                </div>

                <div>

                    <h3 className="mb-6 text-lg text-white font-bold">

                        Legal

                    </h3>

                    <ul className="space-y-4 text-base">

                        <li className="hover:text-white transition-colors">Privacy Policy</li>
                        <li className="hover:text-white transition-colors">Terms of Service</li>
                        <li className="hover:text-white transition-colors">Cookies</li>

                    </ul>

                </div>

            </div>

            <div className="border-t border-slate-700 py-8 text-center text-base">

                <p>© 2026 Abber. All rights reserved.{" "}
                    <Link
                        to="/admin"
                        className="text-slate-500 hover:text-white transition-colors font-medium"
                    >
                        — Make it real.
                    </Link>
                </p>

            </div>

        </footer>

    );

};

export default Footer;
