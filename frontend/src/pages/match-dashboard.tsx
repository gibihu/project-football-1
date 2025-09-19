import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShortName } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner";
import type { MatchType } from "@/types/match";
import MatchEvent from "./match/event";

const API_URL: string = import.meta.env.VITE_API_URL;
export function MatchDashboard() {
    const [match, setmatch] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetchBoard(true);
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${API_URL}/live/live_score`, { credentials: "include" });

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                toast.error(result.message);
            }
            setIsFetchBoard(false);
        };
        fetchData();
        // const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        // return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod(){
        const fetchData = async () => {
            // const res = await fetch(`https://livescore-api.com/api-client/matches/live.json?&key=O9GiRG3laCyROLBr&secret=tsL0gvXuGlkKJUgx4XQVEUhPwPHlBiM5&lang=en`);
            const res = await fetch(`${API_URL}/live/live_score`, { credentials: "include" });

            const result = await res.json();
            // if (result.code == 200) {
            if (result.code == 200) {
                const data = await result.data.match;
                setmatch(data);
            } else {
                const errors = result;
                toast.error(result.message);
            }
        };
        fetchData();
    }


    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 20);
    };
    const handleLoadLess = () => {
        setVisibleCount((prev) => prev - 20);
    };

    const visibleData = match.slice(0, visibleCount);


    return (
        <Card>
            <CardContent>
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-end">Team A</TableHead>
                            <TableHead className="text-center w-30">Score</TableHead>
                            <TableHead className="text-start">Team B</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isFetchBoard && match?.length > 0 ? (
                            visibleData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-0 pl-2 h-10">
                                        <TableCellViewer item={item} className="flex justify-between gap-2 items-center w-full h-full">
                                            <MatchBadge item={item} home={true} />
                                            <div className="flex gap-2">
                                                <span className="line-clamp-1 hidden md:block">{item.home.name}</span>
                                                <span className="line-clamp-1 md:hidden">{ShortName(item.home.name)}.</span>
                                                {/* <span className="truncate">{item.home.name}</span> */}
                                                <img src={item.home.logo} alt={item.home.logo} className="size-4" />
                                            </div>
                                        </TableCellViewer >
                                    </TableCell>
                                    <TableCell className="p-0 h-10 text-center">
                                        <TableCellViewer item={item} className="w-full h-full">
                                            {(() => {
                                                const [homeScore, awayScore] = item.scores.score.split(" - ");
                                                return <>{homeScore} - {awayScore}</>;
                                            })()}
                                        </TableCellViewer >
                                    </TableCell>
                                    <TableCell className="p-0 pr-2 h-10">
                                        <TableCellViewer item={item} className="flex gap-2 justify-between items-center w-full h-full">
                                            <div className="flex gap-2">
                                                <img src={item.away.logo} alt={item.away.logo} className="size-4" />
                                                <span className="line-clamp-1 hidden md:block">{item.away.name}</span>
                                                <span className="line-clamp-1 md:hidden">{ShortName(item.away.name)}.</span>
                                            </div>
                                            <MatchBadge item={item} home={false} />
                                        </TableCellViewer >
                                    </TableCell>
                                </TableRow>
                            )
                            )) : (
                            <TableRow>
                                <TableCell className=""><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell className=""><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell className=""><Skeleton className="h-5 w-full" /></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


                <div className="mt-4 flex flex-col items-center justify-center gap-2">
                    {visibleCount < match.length ? (
                        <>
                            <span className="text-ring text-sm">ยังมีอีก {match.length - visibleCount} ทีมที่กำลังแข่งขัน</span>
                            <div className="flex gap-2">
                                {visibleCount > 20 && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>}
                                <Button onClick={handleLoadMore}>แสดงเพิ่ม</Button>
                            </div>
                        </>
                    ) : (visibleCount == match.length && <Button onClick={handleLoadLess}>แสดงน้อยลง</Button>)}
                </div>

            </CardContent>
        </Card>
    )
}


function ColumSkeleton() {
    return (
        <>
            <Skeleton className="h-5 w-full" />
        </>
    );
}
function TableCellViewer({ item, className, children }: { item: MatchType, className?: string, children?: ReactNode }) {
    const [selectedTab, setSelectedTab] = useState("event");
    return (
        <Dialog>
            <DialogTrigger className={cn(className)}>{children}</DialogTrigger>
            <DialogContent className="md:max-w-[90svw] md:max-h-[90vh] w-auto h-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2">
                                {item.country?.id && (
                                    <img
                                        src={`/api/flag?type=country&id=${item.country.id}`}
                                        className="h-3 w-5"
                                    />
                                )}

                                <span className="text-xs text-ring">{item.location}</span>
                                {IsPlay(item.status) && (
                                    <span className="relative flex size-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                                    </span>
                                )}
                            </div>
                            <div className="w-full flex items-center gap-4">
                                <div className="flex-1 flex flex-col gap-2 items-end">
                                    <div className="flex flex-col items-center gap-2">
                                        <img src={item.home.logo} alt={item.home.logo} className="size-12" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="text-xs uppercase cursor-default">{ShortName(item.home.name)}.</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <p>{item.home.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <span>{item.scores.score}</span>
                                </div>

                                <div className="flex-1 flex flex-col gap-2 items-start">
                                    <div className="flex flex-col items-center gap-2">
                                        <img src={item.away.logo} alt={item.away.logo} className="size-12" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="text-xs uppercase cursor-default">{ShortName(item.away.name)}.</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <p>{item.away.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </DialogTitle>
                    <DialogDescription className="mt-4 w-max" asChild>

                        <div>
                            <div className="flex flex-col gap-4">
                                <div className="w-full flex justify-center">

                                    {IsTime(item.time) ? "เวลา: " + item.time + ` น. (${matchStatus(item.status)})` : matchStatus(item.status)}

                                </div>

                                <div className="grid grid-cols-6 border rounded-xl p-2 py-4 divide-x  divide-border">

                                    <div className="flex flex-col justify-start text-center gap-2 px-2">
                                        <p className="font-bold text-sm">คะแนนครึ่งแรก</p>
                                        <span>{item.scores.ht_score || "-"}</span>
                                    </div>
                                    <div className="flex flex-col justify-start text-center gap-2 px-2">
                                        <p className="font-bold text-sm">คะแนนครึ่งหลัง</p>
                                        <span>{item.scores.ft_score || "-"}</span>
                                    </div>
                                    {/*  */}

                                    <div className="col-span-2">
                                        <div className="bg-chart-1">123</div>
                                    </div>

                                    {/*  */}
                                    <div className="flex flex-col justify-start text-center gap-2 px-2">
                                        <p className="font-bold text-sm">คะแนนต่อเวลา</p>
                                        <span>{item.scores.et_score || "-"}</span>
                                    </div>
                                    <div className="flex flex-col justify-start text-center gap-2 px-2">
                                        <p className="font-bold text-sm">จุดโทษ</p>
                                        <span>{item.scores.ps_score || "-"}</span>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-2">
                                    <Tabs defaultValue="event" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
                                        <TabsList>
                                            <TabsTrigger value="event">อีเว้น</TabsTrigger>
                                            <TabsTrigger value="player">ผู้เล่น</TabsTrigger>
                                        </TabsList>

                                        {/* Render ทั้งหมด แต่ซ่อนด้วย class */}
                                        <div className={selectedTab === "event" ? "block w-full" : "hidden w-full"}>
                                            <MatchEvent match_id={item.id} main_item={item} />
                                        </div>

                                        <div className={selectedTab === "player" ? "block w-full" : "hidden w-full"}>
                                            Change your password here.
                                        </div>
                                    </Tabs>

                                </div>

                            </div>
                        </div>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

function IsTime(time: string): boolean {
    return !["NS", "HT", "FT"].includes(time);
}
function IsPlay(status: string): boolean {
    return !["FINISHED", "NOT STARTED"].includes(status);
}

function matchStatus(status: string) {
    let text = '';
    switch (status) {
        case "NOT STARTED":
            text = "ยังไม่เริ่ม";
            break;
        case "IN PLAY":
            text = "ลงสนาม";
            break;
        case "ADDED TIME":
            text = "เพิ่มเวลา";
            break;
        case "HALF TIME BREAK":
            text = "พักครึ่งแรก";
            break;
        case "FINISHED":
            text = "จบแล้ว";
            break;
        default:
            text = "ไม่ทราบสถานะ";
    }


    return text;
}
function whoWon(score: string): string | null {
    const [homeScoreStr, awayScoreStr] = score.split(" - ").map(s => s.trim());

    // ถ้าเป็น ? หรือแปลงไม่ได้ ให้ return null
    if (homeScoreStr === "?" || awayScoreStr === "?") {
        return null;
    }

    const homeScore = parseInt(homeScoreStr);
    const awayScore = parseInt(awayScoreStr);

    if (isNaN(homeScore) || isNaN(awayScore)) {
        return null;
    }

    if (homeScore > awayScore) {
        return "1";
    } else if (homeScore < awayScore) {
        return "2";
    } else {
        return "x";
    }
}

function MatchBadge({ item, home = true }: { item: any, home: boolean }) {
    const status = item.status;
    const score = item.scores.score;
    if (status === "ADDED TIME") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "IN PLAY") {
        return <Badge variant="outline">{item.time} น.</Badge>;
    } else if (status == "HALF TIME BREAK") {
        return <Badge variant="outline">พัก</Badge>;
    } else if (status !== "FINISHED") {
        return <div></div>;
    }

    if (home) return whoWon(score) == "1" ? <Badge variant="success">ชนะ</Badge> : (whoWon(score) == "2" ? <Badge variant="destructive">แพ้</Badge> : <Badge variant="default">เสมอ</Badge>)
    return whoWon(score) == "2" ? <Badge variant="success">ชนะ</Badge> : (whoWon(score) == "1" ? <Badge variant="destructive">แพ้</Badge> : <Badge variant="default">เสมอ</Badge>)
}