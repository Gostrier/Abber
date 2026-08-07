import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AuthLayout from "../../../components/auth/AuthLayout";
import AuthCard from "../../../components/auth/AuthCard";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { getRoleHome } from "../../../utils/roleNavigation";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login(data);
      toast.success("Welcome back!");
      navigate(getRoleHome(response?.roles ?? []));
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid email or password.";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue building your future."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required"
            })}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required"
            })}
          />

          <div className="flex items-center justify-center">
            <Link
              to="/forgot-password"
              className="text-lg font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            fullWidth
            loading={isSubmitting}
            type="submit"
            size="xl"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-10 text-center text-lg text-gray-500">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-primary font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
