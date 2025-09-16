import { Head } from "@/components/app-head";
import { LoginForm } from "@/components/login-form";
import AppLayout from "@/layout/app-layout";

export default function LoginPage(){
    return(
        <AppLayout>
            <Head title="Home" />
            <LoginForm className="py-12"/>
        </AppLayout>
    );
}
