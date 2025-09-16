import * as React from "react"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState } from "@tanstack/react-table"
import { useEffect, useState, type ReactNode } from "react"
import type { MatchType } from "@/types/match"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ShortName } from "@/lib/functions"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import MatchEvent from "./event"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL: string = import.meta.env.VITE_API_URL;
export function LiveScore() {
    const [match, setmatch] = useState<MatchType[]>([]);
    const [isFetchBoard, setIsFetchBoard] = useState(false);

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
                const errors = result;
                toast.error(result.message, { description: errors.detail || result.code || '' });
            }
            setIsFetchBoard(false);
        };
        fetchData();
        // const intervalId = setInterval(hanffleRelod, 60000);

        // ล้าง interval เมื่อ component ถูก unmount
        // return () => clearInterval(intervalId);
    }, []);

    function hanffleRelod() {
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
                toast.error(result.message, { description: errors.detail || result.code || '' });
            }
        };
        fetchData();
    }


    const columns: ColumnDef<MatchType>[] = [
        {
            accessorKey: "home",
            header: () => (<div className="text-end">เจ้าบ้าน</div>),
            filterFn: (row, columnId, value) => {
                const homeTeamName = row.original.home?.name?.toLowerCase() || "";
                const awayTeamName = row.original.away?.name?.toLowerCase() || "";
                const searchValue = value?.toLowerCase() || "";

                return homeTeamName.includes(searchValue) || awayTeamName.includes(searchValue);
            },
            cell: ({ row }) => {
                const item = row.original.home;
                const momItem = row.original;
                return (
                    <TableCellViewer item={momItem} className="flex justify-between gap-2 items-center w-full h-full">
                        <MatchBadge item={momItem} home={true} />
                        <div className="flex gap-2">
                            <span className="line-clamp-1 hidden md:block">{item.name}</span>
                            <span className="line-clamp-1 md:hidden">{ShortName(item.name)}.</span>
                            <img src={item.logo} alt={item.logo} className="size-4" />
                        </div>
                    </TableCellViewer>
                );
            },
        },
        {
            accessorKey: "score",
            header: () => (<div className="text-center">คะแนน</div>),
            cell: ({ row }) => {
                const item = row.original.scores;
                const momItem = row.original;
                return (<TableCellViewer item={momItem} className="w-full h-full">{item.score}</TableCellViewer>);
            },
        },
        {
            accessorKey: "away",
            header: "แขก",
            cell: ({ row }) => {
                const item = row.original.away;
                const momItem = row.original;
                return (
                    <TableCellViewer item={momItem} className="flex gap-2 justify-between items-center w-full h-full">
                        <div className="flex gap-2">
                            <img src={item.logo} alt={item.logo} className="size-4" />
                            <span className="line-clamp-1 hidden md:block">{item.name}</span>
                            <span className="line-clamp-1 md:hidden">{ShortName(item.name)}.</span>
                        </div>
                        <MatchBadge item={momItem} home={false} />
                    </TableCellViewer>
                );
            },
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: match,
        columns,
        enableColumnFilters: true, // เพิ่มบรรทัดนี้
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });


    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("home")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("home")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className={header.id === 'score' ? 'w-30' : ''}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-0 px-2 h-10">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    ยังไม่มีการแข่งขัน
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4 my-4">
                <div className="text-muted-foreground hidden flex-1 text-sm md:flex">
                    {table.getFilteredRowModel().rows.length} รายการ
                </div>
                <div className="flex w-full items-center gap-8 md:w-fit">
                    <div className="hidden items-center gap-2 md:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            รายการต่อหน้า
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        หน้า {table.getState().pagination.pageIndex + 1} จาก{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
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