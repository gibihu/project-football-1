import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePage } from "@/hooks/usePage";
import AuthLayout from "@/layout/auth-layouy";
import { formatDateTime, timeDiff, timeDiffRounded } from "@/lib/functions";
import { translateStatus } from "@/lib/transaction.fn";
import { csrf } from "@/middlewares/CsrfMiddleware";
import type { TransactionType } from "@/types/global";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SelectPackpoint from "./components/pack-point";


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
                    toast.error(result.message);
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
                                <TableHead className="text-center">อนุมัติเวลา</TableHead>
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
                                                    <img className="size-15  rounded-md  object-cover" src={item.slip_url} alt={item.slip_url} />
                                                }
                                            </TableViewImage>
                                        </TableCell>
                                        <TableCell className="text-start">
                                            <div className="flex flex-col">
                                                <span>เติม {item.points} พอยต์</span>
                                                <span>ราคา {item.amount} {item.currency}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span>{formatDateTime(item.approved_at || '')}</span>
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


export function TableViewImage({ item, className, children }: { item: TransactionType, className?: string, children?: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="max-h-svh max-w-[90svw] w-max sm:max-w-auto">
                <DialogHeader>
                    <DialogDescription>
                        <ImageWithSkeleton
                            src={item.slip_url ?? ''}
                            alt={item.slip_url ?? 'No Image'}
                            title=''
                            className='max-h-[90svh] max-w-[90svw] w-max object-contain'
                        />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}