import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    Users,
    Rocket,
} from "lucide-react";

import Button from "../../../components/ui/Button";

const Hero = () => {

    return (

        <section
            className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-blue-50
                via-white
                to-violet-50
            "
        >

            {/* Background Blur */}

            <div
                className="
                    absolute
                    -top-20
                    -left-20
                    h-96
                    w-96
                    rounded-full
                    bg-blue-400/20
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    right-0
                    bottom-0
                    h-[35rem]
                    w-[35rem]
                    rounded-full
                    bg-violet-500/20
                    blur-3xl
                "
            />

            <div
                className="
                    relative
                    mx-auto
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    items-start
                    gap-12
                    lg:gap-20
                    px-8
                    py-20
                    lg:py-32
                    max-w-7xl
                "
            >

                {/* Left */}

                <motion.div

                    className="flex flex-col justify-center w-full z-10"

                    initial={{
                        opacity: 0,
                        x: -40,
                    }}

                    animate={{
                        opacity: 1,
                        x: 0,
                    }}

                    transition={{
                        duration: .8,
                    }}

                >

                    <div
                        className="
                            mb-6
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-primary/10
                            px-6
                            py-3
                            text-base
                            font-semibold
                            text-primary
                        "
                    >

                        <Sparkles size={20} />

                        Empowering Future Innovators

                    </div>

                    <h1
                        className="
                            text-4xl
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                            font-extrabold
                            leading-tight
                            md:leading-[1.1]
                            tracking-tight
                            text-slate-900
                        "
                    >

                        Turn Great Ideas Into

                        <span
                            className="
                                bg-gradient-to-r
                                from-primary
                                to-violet-600
                                bg-clip-text
                                text-transparent
                            "
                        >

                            {" "}Successful Startups

                        </span>

                    </h1>

                    <p
                        className="
                            mt-6
                            max-w-2xl
                            text-lg
                            sm:text-xl
                            leading-relaxed
                            text-slate-600
                        "
                    >

                        Connect with experienced mentors,
                        collaborate with talented innovators,
                        validate your startup ideas,
                        and discover funding opportunities—
                        all in one modern platform.

                    </p>

                    <div className="mt-16 flex flex-wrap gap-10">

                        <div className="flex items-center gap-4">

                            <Rocket
                                size={28}
                                className="text-primary"
                            />

                            <span className="text-lg font-medium text-slate-700">

                                Startup Incubation

                            </span>

                        </div>

                        <div className="flex items-center gap-4">

                            <Users
                                size={28}
                                className="text-primary"
                            />

                            <span className="text-lg font-medium text-slate-700">

                                Expert Mentors

                            </span>

                        </div>

                    </div>

                </motion.div>

                {/* Right */}

                <motion.div

                    className="flex flex-col justify-center w-full"

                    initial={{
                        opacity: 0,
                        x: 40,
                    }}

                    animate={{
                        opacity: 1,
                        x: 0,
                    }}

                    transition={{
                        duration: .8,
                    }}

                >

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">

                        <Link to="/register" className="w-full sm:w-auto">

                            <Button
                                size="lg"
                                fullWidth
                            >

                                Start Building

                                <ArrowRight
                                    className="ml-2"
                                    size={22}
                                />

                            </Button>

                        </Link>

                        <Link to="/login" className="w-full sm:w-auto">

                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                            >

                                Explore Mentors

                            </Button>

                        </Link>

                    </div>

                </motion.div>

            </div>

        </section>

    );

};

export default Hero;
