import { Head } from "@/components/app-head"
import { AppSidebar } from "@/components/app-sidebar"
import { PostTable } from "@/components/dashboard/posts-table"
import AuthLayout from "@/layout/auth-layouy"

export default function PostsPage() {
    return (
        <AuthLayout>
            <Head title="Wallet" />
            <AppSidebar title="Wallet">
                <PostTable />
            </AppSidebar>
        </AuthLayout>
    )
}
