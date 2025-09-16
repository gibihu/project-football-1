import { Head } from "@/components/app-head";
import { RegisForm } from "@/components/register-form";
import AppLayout from "@/layout/app-layout";

export default function RegisPage(){
    return(
        <AppLayout>
            <Head title="Home" />
            <RegisForm className="py-12"/>
        </AppLayout>
    );
}
