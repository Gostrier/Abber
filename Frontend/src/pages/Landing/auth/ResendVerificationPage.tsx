import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import api from "../../../api/axios";

const ResendVerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setSending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification email sent!");
      navigate("/login");
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Resend Verification"
        subtitle="Enter your email to receive a new verification link."
      >
        <div className="space-y-8">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            fullWidth
            loading={sending}
            onClick={handleResend}
            size="xl"
          >
            Resend Verification Email
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResendVerificationPage;
