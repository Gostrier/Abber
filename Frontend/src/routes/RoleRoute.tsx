import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

interface RoleRouteProps {
    roles: string[];
}

const RoleRoute = ({ roles }: RoleRouteProps) => {

    const {
        authenticated,
        loading,
        user,
    } = useAuth();

    if (loading) {

        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );

    }

    if (!authenticated) {

        return <Navigate to="/login" replace />;

    }

    const hasRole = (user?.roles ?? [])
        .some((role) => roles.includes(role));

    if (!hasRole) {

        return <Navigate to="/dashboard" replace />;

    }

    return <Outlet />;
};

export default RoleRoute;
