import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import AuthLayout from "@/layout/auth-layouy";
import SelectPackpoint from "./components/pay-point";


export default function PackPointPage() {
    return (
        <AuthLayout>
            <Head title="Point" />
            <AppSidebar title="Point">
                <SelectPackpoint
                    onChange={(id) => console.log("เลือก:", id)}
                    onSubmit={(id) => console.log("กด Submit ได้ค่า:", id)}
                />
            </AppSidebar>
        </AuthLayout>
    );
}