
import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { usePage } from "@/hooks/usePage";
import AuthLayout from "@/layout/auth-layouy";

export default function DashboardHome() {
    usePage.getState().fetchUser(true);
    return (
        <AuthLayout>
            <Head title="Dashboard" />
            <AppSidebar title="Dashboard">
                {/* <UserTable /> */}
            </AppSidebar>
        </AuthLayout>
    )
}
