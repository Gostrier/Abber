import { lazy, Suspense } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import MainLayout from "./layouts/Mainlayout";

import LandingPage from "./pages/Landing/LandingPage";

import LoginPage from "./pages/Landing/auth/LoginPage";
import RegisterPage from "./pages/Landing/auth/RegisterPage";
import VerifyEmailPage from "./pages/Landing/auth/VerifyEmailPage";
import VerificationSuccessPage from "./pages/Landing/auth/VerificationSuccessPage";
import ResendVerificationPage from "./pages/Landing/auth/ResendVerificationPage";
import ForgotPasswordPage from "./pages/Landing/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Landing/auth/ResetPasswordPage";

import NotFoundPage from "./pages/errors/NotFoundPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Spinner from "./components/ui/Spinner";

const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const StartupStagePage = lazy(() => import("./pages/Stages/StartupStagePage"));
const PublicChatPage = lazy(() => import("./pages/Chat/PublicChatPage"));
const IdeasPage = lazy(() => import("./pages/Ideas/IdeasPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoon/ComingSoonPage"));

const pageFallback = (
    <div className="flex h-screen items-center justify-center">
        <Spinner />
    </div>
);

function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            borderRadius: "12px",
                            fontSize: "14px",
                        },
                    }}
                />

                <ErrorBoundary>

                <Routes>

                    {/* Public */}

                    <Route element={<PublicRoute />}>

                        <Route
                            path="/"
                            element={<LandingPage />}
                        />

                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />

                        <Route
                            path="/register"
                            element={<RegisterPage />}
                        />

                        <Route
                            path="/verify-email"
                            element={<VerifyEmailPage />}
                        />

                        <Route
                            path="/verification-success"
                            element={<VerificationSuccessPage />}
                        />

                        <Route
                            path="/resend-verification"
                            element={<ResendVerificationPage />}
                        />

                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />

                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />

                    </Route>

                    {/* Protected */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<MainLayout />}>

                            <Route
                                path="/dashboard"
                                element={
                                    <Suspense fallback={pageFallback}>
                                        <DashboardPage />
                                    </Suspense>
                                }
                            />

                            <Route path="/ideas" element={<Suspense fallback={pageFallback}><IdeasPage /></Suspense>} />

                            <Route path="/stages/idea" element={<Suspense fallback={pageFallback}><StartupStagePage stageId="idea" /></Suspense>} />
                            <Route path="/stages/validation" element={<Suspense fallback={pageFallback}><StartupStagePage stageId="validation" /></Suspense>} />
                            <Route path="/stages/develop" element={<Suspense fallback={pageFallback}><StartupStagePage stageId="develop" /></Suspense>} />
                            <Route path="/stages/scale" element={<Suspense fallback={pageFallback}><StartupStagePage stageId="scale" /></Suspense>} />

                            <Route path="/chat" element={<Suspense fallback={pageFallback}><PublicChatPage /></Suspense>} />

                            <Route path="/mentors" element={<Suspense fallback={pageFallback}><ComingSoonPage title="Mentors" description="Mentor matching is coming soon. Your assigned mentor and sessions will appear here." /></Suspense>} />
                            <Route path="/messages" element={<Suspense fallback={pageFallback}><ComingSoonPage title="Messages" description="Direct messaging with mentors is coming soon." /></Suspense>} />
                            <Route path="/settings" element={<Suspense fallback={pageFallback}><ComingSoonPage title="Settings" description="Profile and account settings are coming soon." /></Suspense>} />

                        </Route>

                    </Route>

                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />

                </Routes>

                </ErrorBoundary>

            </AuthProvider>

        </BrowserRouter>

    );

}

export default App;
