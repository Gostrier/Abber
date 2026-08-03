import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Button from "../../../components/ui/Button";
import api from "../../../api/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");
  const justRegistered = searchParams.get("sent") === "1";

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setSuccess(true);
        toast.success("Email verified successfully!");
      })
      .catch(() => {
        setSuccess(false);
        toast.error("Verification failed. The link may be expired.");
      })
      .finally(() => setVerifying(false));
  }, [searchParams, token]);

  if (!token && justRegistered) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check Your Email"
          subtitle="We've sent you a verification link."
        >
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MailCheck className="text-blue-600" size={32} />
            </div>
            <p className="mt-6 text-xl text-slate-600">
              Click the link in the email we just sent to activate your account.
            </p>
            <p className="mt-4 text-lg text-slate-500">
              Didn't receive it? Check your spam folder or request a new one.
            </p>
            <div className="mt-8 space-y-4">
              <Button size="xl" onClick={() => navigate("/resend-verification")}>
                Resend Verification Email
              </Button>
              <div>
                <Button size="xl" variant="secondary" onClick={() => navigate("/login")}>
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Email Verification"
        subtitle={
          verifying
            ? "Verifying your email..."
            : success
              ? "Your email has been verified!"
              : "Verification failed"
        }
      >
        <div className="py-8 text-center">
          {verifying ? (
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          ) : success ? (
            <div className="space-y-8">
              <p className="text-xl text-slate-600">
                You can now sign in and start building your startup.
              </p>
              <Button size="xl" onClick={() => navigate("/login")}>
                Continue to Login
                <ArrowRight size={28} />
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-xl text-slate-600">
                This link is invalid or expired. Request a new one.
              </p>
              <Button size="xl" onClick={() => navigate("/resend-verification")}>
                Resend Verification
                <ArrowRight size={28} />
              </Button>
            </div>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
