import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";

const NotFoundPage = () => {
    return (

        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50">

            <div className="text-center max-w-2xl px-8">

                <h1 className="text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">

                    404

                </h1>

                <h2 className="mt-8 text-4xl font-bold text-slate-900">

                    Page Not Found

                </h2>

                <p className="mt-4 text-xl text-slate-500">

                    The page you requested does not exist or has been moved.

                </p>

                <Link to="/">

                    <Button className="mt-10" size="lg">

                        Return Home

                    </Button>

                </Link>

            </div>

        </div>

    );
};

export default NotFoundPage;
