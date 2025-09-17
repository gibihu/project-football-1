import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import AuthLayout from "@/layout/auth-layouy";
import SelectPackpoint from "./components/pack-point";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { csrf } from "@/middlewares/CsrfMiddleware";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { TransactionType } from "@/types/global";
import { TableViewImage } from "./admins/user-payment";
import { translateStatus } from "@/lib/transaction.fn";
import { usePage } from "@/hooks/usePage";
import { timeDiff, timeDiffRounded } from "@/lib/functions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const API_URL: string = import.meta.env.VITE_API_URL;
export default function PackPointPage() {
    const { user } = usePage();
    const navigate = useNavigate();
    const [isFetch, setIsFetch] = useState<boolean>(true);
    const [items, setItems] = useState<TransactionType[]>([]);


    function handdleCreate(id: string | null) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const csrfToken: string = await csrf();
                if (!csrfToken) {
                    throw new Error('Failed to get CSRF token');
                }
                const res = await fetch(`${API_URL}/transactions`, {
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
        if (id !== null) {
            fetchData();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const res = await fetch(`${API_URL}/transactions?type=user`, { credentials: "include" });
                if (res.status == 200) {
                    const result = await res.json();
                    const data = result.data;
                    // console.log(data);
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
        fetchData();
    }, []);

    function handleUpdate(id: string, status: string) {
        const fetchData = async () => {
            try {
                setIsFetch(true);
                const csrfToken: string = await csrf();
                if (!csrfToken) {
                    throw new Error('Failed to get CSRF token');
                }
                const res = await fetch(`${API_URL}/transaction/${id}`, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        status: status
                    })
                });
                if (res.status == 200) {
                    const result = await res.json();
                    toast.success(result.message);
                    setItems(prev =>
                        prev.map(item =>
                            item.id === id ? { ...item, status } : item
                        )
                    );

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

        fetchData();
    }



    return (
        <AuthLayout>
            <Head title="Point" />
            <AppSidebar title="Point">
                <SelectPackpoint
                    onSubmit={(id) => handdleCreate(id || null)}
                    disabled={isFetch}
                />


                <div className="p-4">
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">สลิป</TableHead>
                                <TableHead className="text-start">รายละเอีบด</TableHead>
                                <TableHead className="text-center">สถาณะ</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isFetch ? (
                                items.map((item, index) => (
                                    <TableRow className="h-16" key={index}>
                                        <TableCell className="">
                                            <TableViewImage item={item}>
                                                {item.status !== "pending" && item.status !== "cancle" &&
                                                    <img className="size-15  rounded-md  object-cover" src="https://scontent.fcnx4-2.fna.fbcdn.net/v/t39.30808-6/465535396_8898901206839277_5920482521751900011_n.jpg?stp=dst-jpg_p130x130_tt6&_nc_cat=110&ccb=1-7&_nc_sid=bd9a62&_nc_ohc=iUmi6qMS5scQ7kNvwERNwcf&_nc_oc=AdlqT0O7UKBme9Joh36Ayiv73tftv4uUco3z8PsWkySKkmhHAT0LSKZg5zt5STt9XQDCq3k9smGiNXD9gWgjWU9C&_nc_zt=23&_nc_ht=scontent.fcnx4-2.fna&_nc_gid=2zC5VYWHUM7Oxn4xuYJBqg&oh=00_AfaDlY-GubOaRp1mlhNrgHPtKT8zMuHiIcTxYMKKs1D1zg&oe=68CFE937" alt="" />
                                                }
                                            </TableViewImage>
                                        </TableCell>
                                        <TableCell className="font-start">
                                            <div className="flex flex-col">
                                                <span>เติม {item.points} พอยต์</span>
                                                <span>ราคา {item.amount} {item.currency}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.status == 'pending' ? (
                                                <Tooltip>
                                                    <TooltipTrigger>หมดอายุ {timeDiffRounded(item.expired_at)}</TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{timeDiff(item.expired_at)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : translateStatus(item.status)}
                                        </TableCell>
                                        <TableCell className="max-w-20">
                                            <div className="flex gap-2 justify-end">
                                                {item.status == 'pending' && (
                                                    <>
                                                        <Button variant="destructive" onClick={() => handleUpdate(item.id, 'cancle')}>ยกเลิก</Button>
                                                        <Link to={`/payment/${item.id}`}>
                                                            <Button variant="default">ทำต่อ</Button>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (null)}
                        </TableBody>
                    </Table>
                </div>
            </AppSidebar>
        </AuthLayout>
    );
}