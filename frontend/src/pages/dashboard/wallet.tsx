import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { usePage } from "@/hooks/usePage";
import AuthLayout from "@/layout/auth-layouy";
import { WallerChart } from "./components/waller-chart";


export default function WalletPage() {
    const { user } = usePage();
    return (
        <AuthLayout>
            <Head title="Wallet" />
            <AppSidebar title="Wallet">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-center min-h-100  ">
                        <div className="text-2xl">
                            {user?.point}
                            <WallerChart />
                        </div>
                    </div>
                </div>
            </AppSidebar>
        </AuthLayout>
    );
}
