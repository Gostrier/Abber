import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    Briefcase,
    Calendar,
    MessageSquare,
    GraduationCap,
    MapPin,
    Users,
    Lightbulb,
    Loader2,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import { getPublicMentors } from "../../../api/publicApi";
import type { MentorProfile } from "../../../api/mentorApi";

const FeaturedMentors = () => {
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        getPublicMentors()
            .then((data) => {
                if (mounted) setMentors(data);
            })
            .catch(() => {
                if (mounted) setMentors([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

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
                        One-on-one guidance from experienced business strategists
                        to help you build, validate, and scale your startup.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 mt-20"
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="animate-spin text-blue-300" size={44} />
                        </div>
                    ) : mentors.length === 0 ? (
                        <EmptyMentorState />
                    ) : (
                        <div className="grid gap-10 lg:grid-cols-2">
                            {mentors.map((mentor, index) => (
                                <MentorCard key={mentor.mentorId} mentor={mentor} index={index} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

const MentorCard = ({
    mentor,
    index,
}: {
    mentor: MentorProfile;
    index: number;
}) => {
    const name = `${mentor.firstName} ${mentor.lastName}`;

    const specialty = mentor.specialty || "Startup Mentor";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * index }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl"
        >
            <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-10">
                    <div className="text-center">
                        <Avatar name={name} size="lg" />
                        <h3 className="mt-6 text-2xl font-bold text-white">
                            {name}
                        </h3>
                        <p className="mt-2 text-lg text-blue-200">{specialty}</p>
                        <div className="mt-4 flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    fill="currentColor"
                                    className="text-yellow-500"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 flex flex-col justify-center p-10">
                    <p className="text-base text-blue-100 leading-relaxed">
                        {mentor.bio ||
                            "Dedicated mentor helping founders turn ideas into funded, scaling ventures across Africa."}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-5">
                        {mentor.yearsOfExperience != null && (
                            <div className="flex items-center gap-3 text-blue-200">
                                <Briefcase size={18} className="text-blue-400" />
                                <span>{mentor.yearsOfExperience}+ Years Experience</span>
                            </div>
                        )}
                        {mentor.company && (
                            <div className="flex items-center gap-3 text-blue-200">
                                <GraduationCap size={18} className="text-blue-400" />
                                <span className="truncate">{mentor.company}</span>
                            </div>
                        )}
                        {mentor.location && (
                            <div className="flex items-center gap-3 text-blue-200">
                                <MapPin size={18} className="text-blue-400" />
                                <span>{mentor.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-blue-200">
                            <Users size={18} className="text-blue-400" />
                            <span>{mentor.menteeCount} Mentees</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-200">
                            <Lightbulb size={18} className="text-blue-400" />
                            <span>{mentor.ideasMentored} Ideas Mentored</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-200">
                            <Calendar size={18} className="text-blue-400" />
                            <span>Available Weekly</span>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <Button size="lg" fullWidth={false} className="w-full">
                            <Calendar size={20} />
                            Book a Consultation
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth={false}
                            className="w-full"
                        >
                            <MessageSquare size={20} />
                            Send Message
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyMentorState = () => (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-14 text-center backdrop-blur-2xl">
        <Avatar name="?" size="lg" />
        <h3 className="mt-6 text-2xl font-bold text-white">Mentors coming soon</h3>
        <p className="mt-4 text-lg text-blue-200">
            Our mentorship network is being onboarded. Check back shortly to meet
            the strategists who will guide your journey.
        </p>
    </div>
);

export default FeaturedMentors;
