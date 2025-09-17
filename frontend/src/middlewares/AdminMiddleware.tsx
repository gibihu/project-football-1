

import { usePage } from "@/hooks/usePage";
import { LoaderCircle } from "lucide-react";
import { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";

function AdminMiddleware({ children }: { children?: JSX.Element }) {

    const fetchUser = usePage((s) => s.fetchUser);
    useEffect(() => { fetchUser() }, []);
    const { user, loading } = usePage();

    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <LoaderCircle className="animate-spin size-10" />
            </div>
        ); // หรือ spinner ก็ได้
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if(user.role !== 'admin'){
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export { AdminMiddleware };