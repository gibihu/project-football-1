import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventTrans } from "@/lib/functions";
import type { EventType } from "@/types/event";
import type { MatchType } from "@/types/match";
import { CornerLeftUp, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const API_URL: string = import.meta.env.VITE_API_URL;
export default function MatchEvent({ match_id, main_item }: { match_id: number, main_item: MatchType}) {
    const [data, setData] = useState<any[]>([]);
    const [events, setEvents] = useState<EventType[]>([]);
    const [match, setMatch] = useState<any[]>([]);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoad(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${API_URL}/match/event?id=${match_id}&status=${main_item.status}`, { credentials: "include" });

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data;
                setEvents(data.event);
                // console.log(data.event);
            } else {
                toast.error(result.message);
            }
            setIsLoad(false);
        };
        fetchData();
    }, [match_id]);

    return (
        <>
            {isLoad ? (
                <div className="w-full flex justify-center">
                    <LoaderCircle className="animate-spin size-6" />
                </div>
            ) : events.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ทีม</TableHead>
                            <TableHead className="min-w-[100px]">การกระทำ</TableHead>
                            <TableHead>นักเตะ</TableHead>
                            <TableHead>นาทีที่</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((item, index) => (
                            (()=>{
                                const home_logo = main_item.home.logo;
                                const away_logo = main_item.away.logo;
                                const done_logo =  item.home_away == 'h' ? home_logo : away_logo
                                return(
                                    <TableRow key={index} className="group hover:text-accent-foreground">
                                        <TableCell>
                                            <img src={done_logo} alt={done_logo} className="size-6" />
                                        </TableCell>
                                        <TableCell className="font-medium">{EventTrans(item.event)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <p className="text-nowrap">{item.player || '-'}</p>
                                                <div className="flex items-center gap-1  ps-1  text-ring  group-hover:text-accent-foreground">
                                                    <CornerLeftUp className="size-3" /><span className="text-xs  cursor-default">{item.info || '-'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.time}</TableCell>
                                    </TableRow>
                                )
                            })()
                        ))}
                    </TableBody>
                </Table>
                ) : <div className="w-full text-center text-ring">ไม่พบอีเว้นของแมตช์นี้</div>
            }
        </>
    );
}