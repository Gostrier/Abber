import { motion } from "framer-motion";
import {
    Star,
    Briefcase,
    Calendar,
    MessageSquare,
    GraduationCap,
    MapPin,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";

const FeaturedMentors = () => {
    return (
        <section
            id="mentors"
            className="relative bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 py-32"
        >
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-5xl font-bold text-white">
                        Meet Your Mentor
                    </h2>
                    <p className="mx-auto mt-8 max-w-4xl text-xl text-blue-200">
                        One-on-one guidance from an experienced business strategist to help you build, validate, and scale your startup.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 mt-20 mx-auto w-full max-w-4xl"
                >
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                        <div className="grid md:grid-cols-5">
                            {/* Avatar Column */}
                            <div className="md:col-span-2 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-12">
                                <div className="text-center">
                                    <Avatar name="Mr. Owino Peter" size="lg" />
                                    <h3 className="mt-6 text-3xl font-bold text-white">Mr. Owino Peter</h3>
                                    <p className="mt-2 text-lg text-blue-200">Business Strategist & Techprenuer</p>
                                    <div className="mt-4 flex items-center justify-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} fill="currentColor" className="text-yellow-500" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Details Column */}
                            <div className="md:col-span-3 p-12 flex flex-col justify-center">
                                <p className="text-lg text-blue-100 leading-relaxed">
                                    With over 15 years of experience in business strategy, startup incubation, and technology innovation across East Africa, Mr. Owino Peter has helped 50+ startups go from idea to funded ventures.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 text-blue-200">
                                        <Briefcase size={20} className="text-blue-400" />
                                        <span>50+ Startups Mentored</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-blue-200">
                                        <GraduationCap size={20} className="text-blue-400" />
                                        <span>MBA - Strategic Management</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-blue-200">
                                        <MapPin size={20} className="text-blue-400" />
                                        <span>Nairobi, Kenya</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-blue-200">
                                        <Calendar size={20} className="text-blue-400" />
                                        <span>Available Weekly</span>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col gap-4">
                                    <Button size="lg" fullWidth={false} className="w-full">
                                        <Calendar size={20} />
                                        Book a Consultation
                                    </Button>
                                    <Button variant="secondary" size="lg" fullWidth={false} className="w-full">
                                        <MessageSquare size={20} />
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedMentors;
