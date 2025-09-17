import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import AuthLayout from "@/layout/auth-layouy";
import SelectPackpoint from "./components/pay-point";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { csrf } from "@/middlewares/CsrfMiddleware";


const API_URL: string = import.meta.env.VITE_API_URL;
export default function PackPointPage() {
    const navigate = useNavigate();
    const [isFetch, setIsFetch] = useState<boolean>(true);


    function handdleCreate(id: string | null){
        const fetchData = async () => {
                try{
                    setIsFetch(true);
                    const csrfToken: string = await csrf();
                    if (!csrfToken) {
                        throw new Error('Failed to get CSRF token');
                    }
                    const res = await fetch(`${API_URL}/transactions`,{
                        method: 'POST',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });
                    if (res.status == 200) {
                        const result = await res.json();
                        toast.success(result.message);
                        const data = result.data;
                        navigate(`/payment/${data.id}`);
                    } else {
                        const errors = await res.json();
                        toast.error(errors.message, { description: errors.code || '' });
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setIsFetch(false);
                }
        }
        if(id !== null){
            fetchData();
        }
    }
    return (
        <AuthLayout>
            <Head title="Point" />
            <AppSidebar title="Point">
                <SelectPackpoint
                    onSubmit={(id) => handdleCreate(id || null)}
                    disabled={isFetch}
                />
            </AppSidebar>
        </AuthLayout>
    );
}