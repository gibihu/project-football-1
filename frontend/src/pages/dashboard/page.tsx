
import AuthLayout from "@/layout/auth-layouy";
import { Head } from "@/components/app-head";
import { UserTable } from "./components/user-table";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardHome() {
    return (
        <AuthLayout>
            <Head title="Dashboard" />
            <AppSidebar title="Dashboard">
                <UserTable />
            </AppSidebar>
        </AuthLayout>
    )
}
