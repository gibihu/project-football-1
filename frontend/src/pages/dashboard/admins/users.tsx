
import { Head } from "@/components/app-head";
import { UserTable } from "./components/user-table";
import { AppSidebar } from "@/components/app-sidebar";
import AdminLayout from "@/layout/admin-layout";

export default function UsersDashboard() {
    return (
        <AdminLayout>
            <Head title="Users" />
            <AppSidebar title="Users">
                <UserTable />
            </AppSidebar>
        </AdminLayout>
    )
}
