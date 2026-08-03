import type { ReactNode } from "react";
import Logo, { AbberBrandText } from "../common/Logo";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({
  children,
}: Props) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white_0,_transparent_45%)]" />

        <div className="relative z-10 max-w-lg text-center px-12">
          <div className="flex flex-col items-center gap-6">
            <Logo size="xl" />
            <AbberBrandText size="xl" className="text-center" />
          </div>

          <h2 className="mt-14 text-6xl font-bold leading-tight">
            Build.
            <br />
            Connect.
            <br />
            Make it real.
          </h2>

          <p className="mt-8 text-2xl text-blue-100 leading-relaxed">
            Join Africa's innovation ecosystem where founders,
            mentors and investors build the future together.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 p-14">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
