import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

const CTA = () => {

    return (

        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-32 text-white">

            <div className="mx-auto max-w-5xl px-8 text-center">

                <h2 className="text-6xl font-bold leading-tight">

                    Ready to Build Your Startup?

                </h2>

                <p className="mt-8 text-2xl opacity-90">

                    Join thousands of innovators,
                    mentors and investors already using Abber.

                </p>

                <div className="mt-12">

                    <Link to="/register">

                        <Button
                            className="bg-white text-primary hover:bg-slate-100"
                            size="lg"
                        >

                            Create Free Account
                            <ArrowRight size={22} />

                        </Button>

                    </Link>

                </div>

            </div>

        </section>

    );

};

export default CTA;
