import { motion } from "framer-motion";
import {
    Lightbulb,
    ClipboardCheck,
    Users,
    Rocket,
    HandCoins,
    TrendingUp,
} from "lucide-react";

const steps = [
    {
        icon: Lightbulb,
        title: "Idea",
        description: "Capture and refine your startup idea."
    },
    {
        icon: ClipboardCheck,
        title: "Validation",
        description: "Validate your concept with mentors and AI insights."
    },
    {
        icon: Users,
        title: "Build Team",
        description: "Find talented co-founders and collaborators."
    },
    {
        icon: Rocket,
        title: "Develop",
        description: "Build your MVP with continuous mentorship."
    },
    {
        icon: HandCoins,
        title: "Funding",
        description: "Pitch to investors and accelerators."
    },
    {
        icon: TrendingUp,
        title: "Scale",
        description: "Launch, grow and expand your startup."
    },
];

const StartupJourney = () => {

    return (

        <section
            id="journey"
            className="bg-white py-32"
        >

            <div className="mx-auto max-w-7xl px-8">

                <div className="text-center">

                    <h2 className="text-5xl font-bold text-slate-900">

                        Your Startup Journey

                    </h2>

                    <p className="mx-auto mt-8 max-w-4xl text-xl text-slate-600">

                        Every successful company starts with a single idea.
                        Abber guides you from inspiration to investment.

                    </p>

                </div>

                <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">

                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        return (

                            <motion.div

                                key={step.title}

                                initial={{ opacity: 0, y: 30 }}

                                whileInView={{ opacity: 1, y: 0 }}

                                viewport={{ once: true }}

                                transition={{ delay: index * .1 }}

                                className="relative rounded-3xl border border-slate-200 bg-slate-50 p-10 hover:border-primary hover:shadow-xl transition"

                            >

                                <div className="absolute -top-6 left-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">

                                    {index + 1}

                                </div>

                                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white">

                                    <Icon size={36} />

                                </div>

                                <h3 className="mt-8 text-2xl font-bold">

                                    {step.title}

                                </h3>

                                <p className="mt-4 text-lg leading-8 text-slate-600">

                                    {step.description}

                                </p>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </section>

    );

};

export default StartupJourney;
