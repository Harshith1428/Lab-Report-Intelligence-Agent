import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    // While we're checking the session, show nothing (avoids flash)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse" />
                    <p className="text-sm text-slate-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Not signed in → send to auth page
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
}
