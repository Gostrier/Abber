import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import { resetPasswordRequest } from "../../../api/authApi";

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>();

  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Missing reset token. Please request a new link.");
      return;
    }

    try {
      await resetPasswordRequest(token, data.newPassword, data.confirmPassword);
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password. The link may be expired.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Set a New Password"
        subtitle="Choose a strong password for your account."
      >
        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck className="text-green-600" size={32} />
            </div>
            <p className="mt-6 text-lg text-slate-600">
              Your password has been updated. You can now sign in.
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button size="lg">Go to Login</Button>
              </Link>
            </div>
          </div>
        ) : !token ? (
          <div className="py-8 text-center">
            <p className="text-lg text-slate-600">
              This reset link is invalid or incomplete. Please request a new one.
            </p>
            <div className="mt-8">
              <Link to="/forgot-password">
                <Button size="lg">Request New Link</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <PasswordInput
              label="New Password"
              placeholder="Create a strong password"
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />

            <Button fullWidth loading={isSubmitting} type="submit" size="xl">
              Reset Password
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

export default ResetPasswordPage;
