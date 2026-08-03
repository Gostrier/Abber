import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import Logo, { AbberBrandText } from "../../../components/common/Logo";
import Button from "../../../components/ui/Button";

const navLinks = [
    {
        name: "Features",
        href: "#features",
    },
    {
        name: "Mentors",
        href: "#mentors",
    },
    {
        name: "Journey",
        href: "#journey",
    },
    {
        name: "Testimonials",
        href: "#testimonials",
    },
];

const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);

    return (

        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-white/20
                bg-white/80
                backdrop-blur-xl
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-24
                    max-w-7xl
                    items-center
                    justify-between
                    px-8
                "
            >

                <div className="flex items-center gap-3">
                    <Logo size="md" />
                    <Link to="/" className="hover:opacity-90 transition-opacity flex items-center">
                        <AbberBrandText size="md" />
                    </Link>
                </div>

                {/* Desktop */}

                <nav className="hidden items-center gap-12 lg:flex">

                    {navLinks.map((item) => (

                        <a
                            key={item.name}
                            href={item.href}
                            className="
                                text-base
                                font-semibold
                                text-slate-600
                                transition-colors
                                hover:text-primary
                            "
                        >
                            {item.name}
                        </a>

                    ))}

                </nav>

                {/* Desktop Buttons */}

                <div className="hidden items-center gap-4 lg:flex">

                    <Link to="/login">

                        <Button
                            variant="ghost"
                            size="md"
                        >
                            Login
                        </Button>

                    </Link>

                    <Link to="/register">

                        <Button>
                            Get Started
                        </Button>

                    </Link>

                </div>

                {/* Mobile */}

                <button
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                    className="lg:hidden"
                >

                    {

                        mobileOpen
                            ? <X size={32} />
                            : <Menu size={32} />

                    }

                </button>

            </div>

            {/* Mobile Menu */}

            {

                mobileOpen && (

                    <motion.div

                        initial={{
                            opacity: 0,
                            y: -20,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        exit={{
                            opacity: 0,
                        }}

                        className="
                            border-t
                            bg-white
                            lg:hidden
                        "
                    >

                        <div className="flex flex-col gap-6 px-8 py-10">

                            {

                                navLinks.map((item) => (

                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="
                                            text-xl
                                            font-semibold
                                            text-slate-700
                                        "
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                    >
                                        {item.name}
                                    </a>

                                ))

                            }

                            <Link
                                to="/login"
                                onClick={() =>
                                    setMobileOpen(false)
                                }
                            >

                                <Button
                                    variant="outline"
                                    fullWidth
                                >

                                    Login

                                </Button>

                            </Link>

                            <Link
                                to="/register"
                                onClick={() =>
                                    setMobileOpen(false)
                                }
                            >

                                <Button
                                    fullWidth
                                >

                                    Get Started

                                </Button>

                            </Link>

                        </div>

                    </motion.div>

                )

            }

        </header>

    );

};

export default Navbar;
