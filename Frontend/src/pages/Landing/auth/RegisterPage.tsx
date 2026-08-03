import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import SkillsInput from "../../../components/ui/SkillsInput";
import { useAuth } from "../../../context/AuthContext";

const kenyanCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  county: string;
  town: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const [skills, setSkills] = useState<string[]>([]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ ...data, skills });
      toast.success("Account created! Welcome to Abber.");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create Your Account"
        subtitle="Join the Abber innovation community."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-2 gap-8">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
          </div>

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

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+254 7XX XXX XXX"
            {...register("phoneNumber")}
          />

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-center text-lg font-semibold text-slate-700">County</label>
              <select
                {...register("county", { required: "County is required" })}
                className="w-full appearance-none rounded-3xl border-2 border-slate-300 bg-white py-5 px-6 text-center text-lg outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20"
              >
                <option value="">Select county</option>
                {kenyanCounties.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.county && (
                <p className="text-center text-base font-medium text-red-600">{errors.county.message}</p>
              )}
            </div>

            <Input
              label="Town / Location"
              placeholder="Nairobi"
              error={errors.town?.message}
              {...register("town", { required: "Town is required" })}
            />
          </div>

          <SkillsInput
            label="Skills & Expertise"
            value={skills}
            onChange={setSkills}
            placeholder="Add your skills..."
          />

          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password", {
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
                value === watch("password") || "Passwords do not match",
            })}
          />

          <Button fullWidth loading={isSubmitting} type="submit" size="xl">
            Create Account
          </Button>
        </form>

        <div className="mt-10 text-center text-lg text-gray-500">
          Already have an account?
          <Link to="/login" className="ml-2 text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;
