import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePage } from "@/hooks/usePage";
import AdminLayout from "@/layout/admin-layout";
import { translateStatus } from "@/lib/transaction.fn";
import type { TransactionType } from "@/types/global";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL: string = import.meta.env.VITE_API_URL;
export default function UserPaymentPage() {
    const { user, loading } = usePage();
    const navigate = useNavigate();
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [items, setItems] = useState<TransactionType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(`${API_URL}/transactions?type=${user?.role}`, { credentials: "include" });
                if (res.status == 200) {
                    const result = await res.json();
                    const data = result.data;
                    console.log(data);
                    setItems(data);
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
        if(!loading){
            fetchData();
        }
    }, [loading]);

    return (
        <AdminLayout>
            <Head title="User payment" />
            <AppSidebar title="User payment">
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">สลิป</TableHead>
                            <TableHead className="text-start">รายละเอีบด</TableHead>
                            <TableHead className="text-start">เลขอ้างอิง</TableHead>
                            <TableHead className="text-center">สถาณะ</TableHead>
                            <TableHead className="text-right">สถาณะ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isFetch ? (
                            items.map((item, index) => (
                                <TableRow className="h-16" key={index}>
                                    <TableCell className="">
                                        <TableViewImage item={item}>
                                            <img className="size-15  rounded-md  object-cover" src="https://scontent.fcnx4-2.fna.fbcdn.net/v/t39.30808-6/465535396_8898901206839277_5920482521751900011_n.jpg?stp=dst-jpg_p130x130_tt6&_nc_cat=110&ccb=1-7&_nc_sid=bd9a62&_nc_ohc=iUmi6qMS5scQ7kNvwERNwcf&_nc_oc=AdlqT0O7UKBme9Joh36Ayiv73tftv4uUco3z8PsWkySKkmhHAT0LSKZg5zt5STt9XQDCq3k9smGiNXD9gWgjWU9C&_nc_zt=23&_nc_ht=scontent.fcnx4-2.fna&_nc_gid=2zC5VYWHUM7Oxn4xuYJBqg&oh=00_AfaDlY-GubOaRp1mlhNrgHPtKT8zMuHiIcTxYMKKs1D1zg&oe=68CFE937" alt="" />
                                        </TableViewImage>
                                    </TableCell>
                                    <TableCell className="text-start">
                                        <div className="flex flex-col">
                                            <span>เติม {item.points} พอยต์</span>
                                            <span>ราคา {item.amount} {item.currency}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-start">
                                        {item.user_reference}
                                    </TableCell>
                                    <TableCell className="text-center">{translateStatus(item.status)}</TableCell>
                                    <TableCell className="max-w-20">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="destructive">ปฏิเสธ</Button>
                                            <Button variant='primary'>อนุมัติ</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (null)}
                    </TableBody>
                </Table>
            </AppSidebar>
        </AdminLayout>
    );
}


export function TableViewImage({ item, className, children }: { item: TransactionType, className?: string, children?: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="max-h-svh max-w-[90svw] w-max sm:max-w-auto">
                <DialogHeader>
                    <DialogDescription>
                        <ImageWithSkeleton
                            src="https://scontent.fcnx4-2.fna.fbcdn.net/v/t39.30808-6/465535396_8898901206839277_5920482521751900011_n.jpg?stp=dst-jpg_p130x130_tt6&_nc_cat=110&ccb=1-7&_nc_sid=bd9a62&_nc_ohc=iUmi6qMS5scQ7kNvwERNwcf&_nc_oc=AdlqT0O7UKBme9Joh36Ayiv73tftv4uUco3z8PsWkySKkmhHAT0LSKZg5zt5STt9XQDCq3k9smGiNXD9gWgjWU9C&_nc_zt=23&_nc_ht=scontent.fcnx4-2.fna&_nc_gid=2zC5VYWHUM7Oxn4xuYJBqg&oh=00_AfaDlY-GubOaRp1mlhNrgHPtKT8zMuHiIcTxYMKKs1D1zg&oe=68CFE937"
                            alt=''
                            title=''
                            className='max-h-[90svh] max-w-[90svw] w-max object-contain'
                        />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}