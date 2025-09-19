
import AuthLayout from "@/layout/auth-layouy";
import { Head } from "@/components/app-head";
import { UserTable } from "./components/user-table";
import { AppSidebar } from "@/components/app-sidebar";
import { usePage } from "@/hooks/usePage";

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
