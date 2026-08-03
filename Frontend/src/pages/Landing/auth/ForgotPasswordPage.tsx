import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { forgotPasswordRequest } from "../../../api/authApi";

type ForgotPasswordForm = {
  email: string;
};

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPasswordRequest(data.email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Your Password"
        subtitle="Enter your email and we'll send you a reset link."
      >
        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="text-green-600" size={32} />
            </div>
            <p className="mt-6 text-lg text-slate-600">
              If an account exists for that email, a password reset link has been sent.
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button size="lg">Back to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />

            <Button fullWidth loading={isSubmitting} type="submit" size="xl">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-10 text-center text-lg text-gray-500">
          Remembered your password?
          <Link to="/login" className="ml-2 text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
