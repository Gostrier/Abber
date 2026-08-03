import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Statistics from "./components/Statistics";
import FeaturedMentors from "./components/FeaturedMentors";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Statistics />
            <FeaturedMentors />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
