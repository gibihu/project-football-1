
import AuthLayout from "@/layout/auth-layouy";
import { Head } from "@/components/app-head";
import { UserTable } from "./components/user-table";
import { AppSidebar } from "@/components/app-sidebar";

export default function UsersDashboard() {
    return (
        <AuthLayout>
            <Head title="Users" />
            <AppSidebar title="Users">
                <UserTable />
            </AppSidebar>
        </AuthLayout>
    )
}
