import { motion } from "framer-motion";

const companies = [
    "Google",
    "Microsoft",
    "GitHub",
    "AWS",
    "Y Combinator",
    "OpenAI",
];

const TrustedBy = () => {

    return (

        <section className="bg-white py-20">

            <div className="mx-auto max-w-7xl px-8">

                <motion.div

                    initial={{ opacity: 0 }}

                    whileInView={{ opacity: 1 }}

                    viewport={{ once: true }}

                    transition={{ duration: 0.6 }}

                >

                    <p className="text-center text-base font-semibold uppercase tracking-[0.3em] text-slate-500">

                        Trusted by founders, innovators and mentors

                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">

                        {companies.map((company) => (

                            <motion.div

                                key={company}

                                whileHover={{
                                    y: -8,
                                    scale: 1.06,
                                }}

                                className="
                                    flex
                                    h-24
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    text-lg
                                    font-bold
                                    text-slate-500
                                    transition-all
                                    hover:border-primary
                                    hover:text-primary
                                    hover:shadow-lg
                                "

                            >

                                {company}

                            </motion.div>

                        ))}

                    </div>

                </motion.div>

            </div>

        </section>

    );

};

export default TrustedBy;
