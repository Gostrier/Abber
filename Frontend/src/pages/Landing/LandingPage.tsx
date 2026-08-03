import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import IdeaCategories from "./components/IdeaCategories";
import FeaturedMentors from "./components/FeaturedMentors";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <IdeaCategories />
            <FeaturedMentors />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
