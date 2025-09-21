import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import AuthLayout from "@/layout/auth-layouy";
import { WallerChart } from "../../components/dashboard/waller-chart";
import WalletHistoryTable from "../../components/dashboard/wallet-history-table";


export default function WalletPage() {
    return (
        <AuthLayout>
            <Head title="Wallet" />
            <AppSidebar title="Wallet">
                <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4">

                    <div className="w-full px-4 lg:px-0 lg:w-110">
                        <WallerChart />
                    </div>

                    <div className="flex flex-col gpa-4 w-full px-4 lg:px-0">
                        <WalletHistoryTable />
                    </div>

                </div>
            </AppSidebar>
        </AuthLayout>
    );
}
