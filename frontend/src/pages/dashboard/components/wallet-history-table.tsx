import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePage } from "@/hooks/usePage";
import { isUpper, timeAgoShort } from "@/lib/functions";
import { cn } from "@/lib/utils";
import type { WalletHistoryType } from "@/types/global";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const API_URL: string = import.meta.env.VITE_API_URL;
export default function WalletHistoryTable() {
    const [items, setItems] = useState<WalletHistoryType[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/user/wallet/history`, { credentials: "include" });
            const result = await res.json();
            if (result.code == 200) {
                const data = result.data;
                setItems(data);
                setIsLoading(false);
            } else {
                toast.error(result.message, { description: result.code || '' });
            }
        }
        fetchData();

    }, []);



    return (
        <Card className="py-0 overflow-hidden  max-h-[85svh]  overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { isLoading ? (
                        <TableRow>
                            <TableCell  colSpan={2}  className="ps-4">
                                <div className="w-full flex justify-center py-4">
                                    <LoaderCircle className="animate-spin size-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ): items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="ps-4">
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold text-md">{TranslateRole(item.type)}</p>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground">{item.description}</span>
                                        <span className="text-border">เมื่อ {timeAgoShort(item.updated_at)}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={cn('text-right font-bold text-lg pe-4', isUpper(item.change_amount) ? 'text-green-600' : 'text-red-600')}>{(isUpper(item.change_amount) ? '+' : '-' ) + item.change_amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}


export function TranslateRole(type: string){
    let text = '';
    switch(type){
        case 'used':
            text = 'แลกพอยต์';
            break;
        case 'topup':
            text = 'เติมพอยต์';
            break;
        case 'removed':
            text = 'ถอนออก';
            break;
        case 'income':
            text = 'รายได้';
            break;
        default:
            text= 'โบนัส';
    }

    return text;
}