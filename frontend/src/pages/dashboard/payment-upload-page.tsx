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
    const [image, setImage] = useState<File | undefined>(undefined);
    const navigate = useNavigate();
    
    function handlePaid(){
        console.log(image);
        const fetchData = async () => {
            try{
                setIsFetch(true);
                const csrfToken: string = await csrf();
                if (!csrfToken) {
                    throw new Error('Failed to get CSRF token');
                }
                const formData = new FormData();
                formData.append("status", "awaiting_approval");
                if(id){
                    formData.append("id", id);
                }else{
                    throw new Error('ไม่พบหมายเลขธุรกรรมนี้');
                }
                if (image) {
                    formData.append("file", image);
                }else{
                    throw new Error('ไม่พบไฟล์');
                }
                const res = await fetch(`${API_URL}/transaction/upload`,{
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: formData,
                });
                const result = await res.json();
                if (result.code == 200) {
                    toast.success(result.message);
                    // console.log(result);
                    navigate('/pack-point');
                } else {
                    toast.error(result.message, { description: result.code || '' });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }

        if(image !== undefined && image !== null){
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
                        <Button variant="primary" className="w-full" disabled={isFetch || image == undefined} onClick={()=>handlePaid()}>
                            {isFetch && <LoaderCircle className="animate-spin" />}
                            อัพโหลด
                        </Button>
                    </div>

                </div>
            </AppSidebar>
        </AuthLayout>
    );
}