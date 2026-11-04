import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const ProtectedRoute = () => {
    const location = useLocation();

    const {
        authenticated,
        loading,
    } = useAuth();

    if (loading) {

        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );

    }

    if (authenticated) {
        return <Outlet />;
    }

    return (
        <Navigate
            to={location.pathname.startsWith("/admin") ? "/admin/login" : "/login"}
            replace
        />
    );
};

export default ProtectedRoute;