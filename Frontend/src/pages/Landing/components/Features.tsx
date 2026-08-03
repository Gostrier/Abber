import {
    Lightbulb,
    Users,
    Rocket,
    GraduationCap,
    HandCoins,
    Globe2,
} from "lucide-react";

import { motion } from "framer-motion";

const features = [

    {
        icon: Lightbulb,
        title: "Startup Ideation",
        description:
            "Transform innovative ideas into validated startup opportunities using structured frameworks and AI-powered guidance.",
    },

    {
        icon: Users,
        title: "Expert Mentorship",
        description:
            "Connect with experienced founders, industry experts and successful entrepreneurs ready to guide you.",
    },

    {
        icon: Rocket,
        title: "Build Teams",
        description:
            "Find talented developers, designers, marketers and co-founders to build your dream startup.",
    },

    {
        icon: HandCoins,
        title: "Funding Network",
        description:
            "Discover investors, accelerators and funding opportunities tailored to your startup stage.",
    },

    {
        icon: GraduationCap,
        title: "Learning Hub",
        description:
            "Access startup courses, business templates, founder playbooks and mentorship resources.",
    },

    {
        icon: Globe2,
        title: "Community",
        description:
            "Join a vibrant ecosystem of innovators, mentors, universities and startup communities.",
    },

];

const Features = () => {

    return (

        <section
            id="features"
            className="bg-slate-50 py-32"
        >

            <div className="mx-auto max-w-7xl px-8">

                <motion.div

                    className="py-16"

                    initial={{
                        opacity: 0,
                        y: 30,
                    }}

                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}

                    viewport={{
                        once: true,
                    }}

                >

                    <h2 className="text-center text-5xl font-bold text-slate-900">

                        Everything You Need To Build A Startup

                    </h2>

                    <p className="mx-auto mt-8 max-w-4xl text-center text-xl leading-9 text-slate-600">

                        Abber brings mentors, innovators, investors,
                        resources and collaboration into one modern platform
                        so every great idea has a chance to succeed.

                    </p>

                </motion.div>

                <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3 p-6">

                    {features.map((feature, index) => {

                        const Icon = feature.icon;

                        return (

                            <motion.div

                                key={feature.title}

                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}

                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}

                                viewport={{
                                    once: true,
                                }}

                                transition={{
                                    delay: index * 0.08,
                                }}

                                whileHover={{
                                    y: -12,
                                }}

                                className="
                                    group
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-10
                                    shadow-sm
                                    transition-all
                                    hover:border-primary
                                    hover:shadow-2xl
                                "

                            >

                                <div
                                    className="
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-primary
                                        to-violet-600
                                        text-white
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                    "
                                >

                                    <Icon size={36} />

                                </div>

                                <h3 className="mt-8 text-2xl font-bold text-slate-900">

                                    {feature.title}

                                </h3>

                                <p className="mt-4 text-lg leading-8 text-slate-600">

                                    {feature.description}

                                </p>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </section>

    );

};

export default Features;
