import { motion } from "framer-motion";
import {
    Lightbulb,
    Users,
    Rocket,
    HandCoins,
} from "lucide-react";

const statistics = [
    {
        icon: Lightbulb,
        value: "10K+",
        label: "Ideas Submitted",
    },
    {
        icon: Users,
        value: "1,500+",
        label: "Active Mentors",
    },
    {
        icon: Rocket,
        value: "700+",
        label: "Startups Built",
    },
    {
        icon: HandCoins,
        value: "$8M+",
        label: "Funding Raised",
    },
];

const Statistics = () => {

    return (

        <section className="bg-white py-32">

            <div className="mx-auto max-w-7xl px-8">

                <motion.div

                    initial={{ opacity: 0, y: 30 }}

                    whileInView={{ opacity: 1, y: 0 }}

                    viewport={{ once: true }}

                >

                    <h2 className="text-center text-5xl font-bold text-slate-900">

                        Empowering Startup Success

                    </h2>

                    <p className="mx-auto mt-8 max-w-4xl text-center text-xl text-slate-600">

                        Every great startup begins with one idea.
                        Abber connects founders, mentors and investors
                        to accelerate innovation.

                    </p>

                </motion.div>

                <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {statistics.map((stat, index) => {

                        const Icon = stat.icon;

                        return (

                            <motion.div

                                key={stat.label}

                                initial={{ opacity: 0, y: 30 }}

                                whileInView={{ opacity: 1, y: 0 }}

                                viewport={{ once: true }}

                                transition={{
                                    delay: index * 0.1,
                                }}

                                whileHover={{
                                    y: -10,
                                    scale: 1.04,
                                }}

                                className="
                                    rounded-3xl
                                    bg-gradient-to-br
                                    from-blue-600
                                    to-violet-600
                                    p-10
                                    text-white
                                    shadow-xl
                                "

                            >

                                <Icon size={48} />

                                <h3 className="mt-8 text-6xl font-bold">

                                    {stat.value}

                                </h3>

                                <p className="mt-4 text-xl opacity-90">

                                    {stat.label}

                                </p>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </section>

    );

};

export default Statistics;
