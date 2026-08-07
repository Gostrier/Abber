import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import { getRoleHome } from "../utils/roleNavigation";

const PublicRoute = () => {

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

    return authenticated
        ? <Navigate to={getRoleHome(user?.roles ?? [])} replace />
        : <Outlet />;
};

export default PublicRoute;