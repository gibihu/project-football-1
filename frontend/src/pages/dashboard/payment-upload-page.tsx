import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { ImageDropInput } from "@/components/ImageDropInput";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layouy";
import { csrf } from "@/middlewares/CsrfMiddleware";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const API_URL: string = import.meta.env.VITE_API_URL;
export default function PaymentUploadPage() {
    const { id } = useParams();
    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [image, setImage] = useState<File>();
    const navigate = useNavigate();
    
    function handlePaid(file?: File){
        const fetchData = async () => {
            try{
                setIsFetch(true);
                const csrfToken: string = await csrf();
                if (!csrfToken) {
                    throw new Error('Failed to get CSRF token');
                }
                const res = await fetch(`${API_URL}/transaction/${id}`,{
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        status: 'awaiting_approval',
                        image: image,
                    })
                });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    navigate('/pack-point');
                } else {
                    const result = await res.json();
                    const errors = result.errors;
                    toast.error(result.message, { description: errors.detail || errors.code || '' });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }

        if(file !== undefined){
            fetchData();
        }else{
            toast.error("โปรดอัพโหลดในเสร็จโอนเงินของคุณ");
        }
    }


    return (
        <AuthLayout>
            <Head title="Payment" />
            <AppSidebar title="Payment">

                <div className="flex flex-col items-center justify-center gap-4">
                    
                    <ImageDropInput className="w-80 h-120" optional={false}  onChange={(file) => file ? setImage(file) : setImage(undefined)}/>
                    <div className="flex flex-col gap-2 w-80">
                        <Button variant="primary" className="w-full" disabled={isFetch || image == undefined} onClick={()=>handlePaid(image || undefined)}>
                            {isFetch && <LoaderCircle className="animate-spin" />}
                            อัพโหลด
                        </Button>
                    </div>

                </div>
            </AppSidebar>
        </AuthLayout>
    );
}