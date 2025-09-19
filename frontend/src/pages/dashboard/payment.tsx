import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AuthLayout from "@/layout/auth-layouy";
import type { TransactionType } from "@/types/global";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const API_URL: string = import.meta.env.VITE_API_URL;
const IMG_URL: string = import.meta.env.VITE_IMG_URL;
export default function PayMentPage() {
    const { id } = useParams();
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [data, setData] = useState<TransactionType>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(`${API_URL}/transaction/${id}`, { credentials: "include" });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    const data = result.data;
                    console.log(data);
                    setData(data);
                } else {
                    const result = await res.json();
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        }
        fetchData();
    }, [id]);

    function handlePaid(){
        navigate('/payment/upload/'+id);
    }


    return (
        <AuthLayout>
            <Head title="Payment" />
            <AppSidebar title="Payment">
                {!isFetch && (
                    <>
                        <div className="flex flex-col items-center justify-center gap-4">

                            <div className="flex flex-col gap-4 max-w-3/4">
                                <div className="w-full h-full  max-w-100 max-h-100  p-6">
                                    <img className="w-full  border  rounded-xl  shadow-xl" src="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png" alt="https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png" />
                                </div>
                                <div>
                                    <p><span className="text-muted-foreground">รหัสอ้างอิง:</span> {data?.user_reference}</p>
                                    <p><span className="text-muted-foreground">จำนวนเงิน:</span> {data?.amount + ' ' + data?.currency}.</p>
                                    <p><span className="text-muted-foreground">พอยท์ที่จะได้รับ:</span> {data?.points} พอยท์</p>
                                </div>
                                <Button variant="primary" className="shadow-xl" onClick={handlePaid} disabled={isFetch}>
                                    {isFetch && <LoaderCircle  className="animate-spin size-4"/>}
                                    จ่ายเงินเสร็จแล้ว
                                </Button>
                                <Link to={'/pack-point'}>
                                    <Button variant="outline" className="w-full  shadow-xl" disabled={isFetch}>
                                        {isFetch && <LoaderCircle  className="animate-spin size-4"/>}
                                        กลับไปเลือกอีกครั้ง
                                    </Button>
                                </Link>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="text-muted-foreground">ธุรกรรมของคุณจะหมดอายุในดีก</span> 3 วัน
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{data?.expired_at}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <CardDescription>
                                    <p>วิธีชำระผ่านแอพธนาคาร</p>
                                    <ul className="list-decimal ps-5">
                                        <li>เปิดแอพธนาคาร</li>
                                        <li>กดไอคอนสแกน</li>
                                        <li>สแกนคิวอาร์โค้ดที่อยู่บนเจอ</li>
                                        <li>ตรวจสอบจำนวนเงิน</li>
                                        <li>กดยืนยัน</li>
                                    </ul>
                                </CardDescription>
                            </div>

                        </div>
                    </>
                )}
            </AppSidebar>
        </AuthLayout>
    );
}