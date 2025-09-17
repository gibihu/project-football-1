import { Toaster } from "@/components/ui/sonner";
import { AdminMiddleware } from "@/middlewares/AdminMiddleware";
import { type ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
    className?: string
}

export default function AdminLayout({ children }: AppLayoutProps) {
    return (
        <AdminMiddleware>
            <>
                <Toaster position="top-center" />
                {children}
            </>
        </AdminMiddleware>
    );
}