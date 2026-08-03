import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const PublicRoute = () => {

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

    return authenticated
        ? <Navigate to="/dashboard" replace />
        : <Outlet />;
};

export default PublicRoute;