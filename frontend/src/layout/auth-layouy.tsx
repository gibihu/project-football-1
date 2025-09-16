import { Toaster } from "@/components/ui/sonner";
import { AuthMiddleware } from "@/middlewares/AuthMiddleware";
import type { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    className?: string
}

export default function AuthLayout({ children }: AppLayoutProps) {
    return (
        <AuthMiddleware>
            <>
                <Toaster position="top-center" />
                {children}
            </>
        </AuthMiddleware>
    );
}