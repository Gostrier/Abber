import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Button from "../../../components/ui/Button";

const VerificationSuccessPage = () => {
    return (
        <AuthLayout>
            <AuthCard
                title="Email Verified"
                subtitle="Your account has been activated successfully."
            >
                <div className="space-y-8 text-center">

                    <p className="text-xl text-slate-600">
                        You can now sign in and start your startup journey.
                    </p>

                    <Link to="/login">
                        <Button size="xl">
                            Continue to Login
                            <ArrowRight size={28} />
                        </Button>
                    </Link>

                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default VerificationSuccessPage;
