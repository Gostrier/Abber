import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Cpu,
    Sprout,
    Briefcase,
    HeartPulse,
    GraduationCap,
    Wallet,
    Leaf,
    Plane,
    ArrowRight,
    ChevronDown,
} from "lucide-react";

interface SampleIdea {
    title: string;
    description: string;
    tags: string[];
}

interface Category {
    id: string;
    name: string;
    icon: typeof Cpu;
    gradient: string;
    description: string;
    ideas: SampleIdea[];
}

const categories: Category[] = [
    {
        id: "technology",
        name: "Technology",
        icon: Cpu,
        gradient: "from-blue-600 to-indigo-600",
        description: "Software, AI, IoT and digital products.",
        ideas: [
            { title: "AI-Powered Farming Assistant", description: "Smart agriculture using AI and IoT sensors.", tags: ["AI", "IoT", "AgriTech"] },
            { title: "SME Delivery Micro-SaaS", description: "Dispatch, tracking and logistics for small businesses.", tags: ["SaaS", "Logistics"] },
            { title: "Campus Marketplace App", description: "Buy and sell second-hand books and gadgets on campus.", tags: ["Marketplace", "Mobile"] },
            { title: "Global Talent Hub", description: "Match vetted local talent to remote global roles.", tags: ["HR Tech", "Remote Work"] },
        ],
    },
    {
        id: "agriculture",
        name: "Agriculture",
        icon: Sprout,
        gradient: "from-green-600 to-emerald-600",
        description: "AgriTech solutions across the value chain.",
        ideas: [
            { title: "Farm-to-Table Platform", description: "Connect farmers directly with buyers and hotels.", tags: ["AgriTech", "Marketplace"] },
            { title: "Smart Irrigation Controller", description: "Soil-moisture driven irrigation that saves water.", tags: ["IoT", "Sensors"] },
            { title: "Crop Disease Scanner", description: "Snap a leaf to diagnose crop disease instantly.", tags: ["AI", "Mobile"] },
            { title: "Warehouse Receipt Financing", description: "Use stored produce as collateral for loans.", tags: ["Fintech", "AgriFinance"] },
        ],
    },
    {
        id: "business",
        name: "Business & Commerce",
        icon: Briefcase,
        gradient: "from-violet-600 to-purple-600",
        description: "Commerce, e-commerce and SME enablement.",
        ideas: [
            { title: "M-Pesa PoS for Vendors", description: "Cashless payments for street and market vendors.", tags: ["Payments", "Fintech"] },
            { title: "B2B Bulk Buying Co-op", description: "Pool SME orders to unlock wholesale pricing.", tags: ["B2B", "Commerce"] },
            { title: "SME Bookkeeping App", description: "Simple bookkeeping and tax-ready reports for SMEs.", tags: ["SaaS", "Finance"] },
            { title: "Subscription Box for Brands", description: "Curated monthly boxes showcasing African brands.", tags: ["E-commerce", "D2C"] },
        ],
    },
    {
        id: "healthcare",
        name: "Healthcare",
        icon: HeartPulse,
        gradient: "from-rose-600 to-pink-600",
        description: "HealthTech that improves access to care.",
        ideas: [
            { title: "Rural Telemedicine", description: "Video consults connecting rural patients to doctors.", tags: ["HealthTech", "Telehealth"] },
            { title: "Medication Refill App", description: "Reminders and prescription refill delivery.", tags: ["Mobile", "Pharmacy"] },
            { title: "Affordable Diagnostics", description: "Low-cost community diagnostic testing network.", tags: ["MedTech", "Clinics"] },
        ],
    },
    {
        id: "education",
        name: "Education",
        icon: GraduationCap,
        gradient: "from-amber-600 to-orange-600",
        description: "EdTech for learners, teachers and trainers.",
        ideas: [
            { title: "Local Language Learning App", description: "Learn Swahili and regional languages interactively.", tags: ["EdTech", "Languages"] },
            { title: "Vocational Skills Platform", description: "Certified hands-on courses for trades and crafts.", tags: ["EdTech", "Skills"] },
            { title: "AI Tutor for Students", description: "Personalized tutoring for exam preparation.", tags: ["AI", "EdTech"] },
        ],
    },
    {
        id: "finance",
        name: "Finance & Fintech",
        icon: Wallet,
        gradient: "from-teal-600 to-cyan-600",
        description: "Financial inclusion for the modern African consumer.",
        ideas: [
            { title: "Chama Digitizer", description: "Digital group savings, records and payouts.", tags: ["Fintech", "Savings"] },
            { title: "Micro-Insurance for Farmers", description: "Affordable crop and weather insurance.", tags: ["Insurtech", "AgriFinance"] },
            { title: "Mobile Credit Scoring", description: "Alternative data credit scores for the unbanked.", tags: ["Fintech", "Lending"] },
        ],
    },
    {
        id: "sustainability",
        name: "Climate & Sustainability",
        icon: Leaf,
        gradient: "from-lime-600 to-green-600",
        description: "Green businesses for a sustainable future.",
        ideas: [
            { title: "Solar Pay-As-You-Go", description: "Affordable solar power paid in daily instalments.", tags: ["Energy", "Fintech"] },
            { title: "Recycling Marketplace", description: "Connect waste collectors with recyclers.", tags: ["Circular Economy"] },
            { title: "Carbon Credit Aggregator", description: "Help small farmers earn from carbon credits.", tags: ["Climate", "AgriTech"] },
        ],
    },
    {
        id: "tourism",
        name: "Travel & Tourism",
        icon: Plane,
        gradient: "from-sky-600 to-blue-600",
        description: "Unlock the experience and hospitality economy.",
        ideas: [
            { title: "Eco-Lodge Booking Platform", description: "Discover and book eco-friendly stays.", tags: ["Hospitality", "Platform"] },
            { title: "Local Experiences Marketplace", description: "Book authentic tours led by local guides.", tags: ["Travel", "Marketplace"] },
            { title: "Group Travel Planner", description: "Plan and split costs for group adventures.", tags: ["Travel", "Social"] },
        ],
    },
];

const IdeaCategories = () => {

    const [open, setOpen] = useState<string | null>(null);

    return (

        <section className="bg-white py-32">

            <div className="mx-auto max-w-4xl px-8">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >

                    <h2 className="text-center text-5xl font-bold text-slate-900">

                        Explore Ideas by Category

                    </h2>

                    <p className="mx-auto mt-8 max-w-4xl text-center text-xl text-slate-600">

                        Browse curated business ideas across sectors that
                        matter. Click a category to see what you could build.

                    </p>

                </motion.div>

                {/* Category dropdowns */}
                <div className="mt-20 space-y-6">

                    {categories.map((category, index) => {

                        const Icon = category.icon;

                        const isOpen = category.id === open;

                        return (

                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    overflow-hidden
                                    rounded-3xl
                                    border-2
                                    transition-all
                                    duration-300
                                    ${
                                        isOpen
                                            ? `border-transparent bg-gradient-to-br ${category.gradient} shadow-2xl`
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl"
                                    }
                                `}
                            >

                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? null : category.id)}
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        gap-6
                                        p-8
                                        text-left
                                        sm:gap-8
                                        ${
                                            isOpen
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                                    `}
                                >

                                    <div
                                        className={`
                                            inline-flex
                                            shrink-0
                                            rounded-2xl
                                            p-4
                                            transition-colors
                                            duration-300
                                            ${
                                                isOpen
                                                    ? "bg-white/20 text-white"
                                                    : "bg-blue-50 text-blue-600"
                                            }
                                        `}
                                    >

                                        <Icon size={36} />

                                    </div>

                                    <div className="flex-1">

                                        <h3 className="text-2xl font-bold">

                                            {category.name}

                                        </h3>

                                        <p
                                            className={`
                                                mt-2
                                                text-base
                                                ${
                                                    isOpen
                                                        ? "text-white/80"
                                                        : "text-slate-500"
                                                }
                                            `}
                                        >

                                            {category.description}

                                        </p>

                                    </div>

                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`
                                            inline-flex
                                            shrink-0
                                            rounded-full
                                            p-2
                                            ${
                                                isOpen
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                            }
                                        `}
                                    >

                                        <ChevronDown size={24} />

                                    </motion.span>

                                </button>

                                <AnimatePresence initial={false}>

                                    {isOpen && (

                                        <motion.div
                                            key="ideas"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >

                                            <div className="px-8 pb-8 pt-2">

                                                <div className="grid gap-6 sm:grid-cols-2">

                                                    {category.ideas.map((idea) => (

                                                        <div
                                                            key={idea.title}
                                                            className="
                                                                flex
                                                                flex-col
                                                                rounded-2xl
                                                                bg-white/10
                                                                p-6
                                                                backdrop-blur-sm
                                                                transition-all
                                                                duration-300
                                                                hover:bg-white/20
                                                            "
                                                        >

                                                            <h4 className="text-lg font-bold">

                                                                {idea.title}

                                                            </h4>

                                                            <p className="mt-2 flex-1 text-base text-white/80">

                                                                {idea.description}

                                                            </p>

                                                            <div className="mt-5 flex flex-wrap gap-2">

                                                                {idea.tags.map((tag) => (

                                                                    <span
                                                                        key={tag}
                                                                        className="
                                                                            rounded-full
                                                                            bg-white/20
                                                                            px-3
                                                                            py-1
                                                                            text-sm
                                                                            font-semibold
                                                                            text-white
                                                                        "
                                                                    >

                                                                        {tag}

                                                                    </span>

                                                                ))}

                                                            </div>

                                                        </div>

                                                    ))}

                                                </div>

                                            </div>

                                        </motion.div>

                                    )}

                                </AnimatePresence>

                            </motion.div>

                        );

                    })}

                </div>

                <div className="mt-16 text-center">

                    <Link
                        to="/register"
                        className="
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-gradient-to-r
                            from-blue-600
                            to-violet-600
                            px-12
                            py-6
                            text-xl
                            font-semibold
                            text-white
                            shadow-xl
                            transition-all
                            duration-300
                            hover:shadow-2xl
                            hover:opacity-95
                        "
                    >

                        Start Your Own Idea

                        <ArrowRight size={24} />

                    </Link>

                </div>

            </div>

        </section>

    );

};

export default IdeaCategories;
