"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Head } from "@/components/app-head";
import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layout/auth-layouy";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CircleQuestionMark, LoaderCircle } from "lucide-react";
import { csrf } from "@/middlewares/CsrfMiddleware";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. schema ตรวจสอบค่า


const API_URL: string = import.meta.env.VITE_API_URL;
export default function CreatePostPage() {
    const navigate = useNavigate();
    // 2. setup form
    const { user } = usePage();
    const [maxPoints, setMaxPoints] = useState<number>(100);
    useEffect(() => {
        setMaxPoints(MaxPoints(user?.tier || 'bronze'));
    }, [user]);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    const schema = z.object({
        title: z.string().min(1, { message: "กรุณาเพิ่มหัวข้อมทีเด็ด" }).max(200, { message: 'ความยาวต้องไม่เกิน 200 ตัวอักษร' }),
        content: z.string().min(10, { message: "เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร" }).max(3000, { message: 'ความยาวต้องไม่เกิน 3000 ตัวอักษร' }),
        points: z.number({ message: "กรุณากรอกจำนวนพอยต์" }).min(0, { message: 'ต้องมากกว่า 0' }).max(maxPoints, `จำนวนพอยต์ต้องไม่มากกว่า ${maxPoints.toLocaleString()}`),
        submit: z.string(),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            points: 100,
            submit: 'private'
        },
        mode: "onChange",
    });

    // 3. handle submit
    const onSubmit = (data: FormValues) => {
        const fetchData = async () => {
            setIsFetch(true);
            const csrfToken: string = await csrf();
            if (!csrfToken) {
                throw new Error('Failed to get CSRF token');
            }
            const res = await fetch(`${API_URL}/post/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(data),
            })

            const result = await res.json();
            if (result.code == 201) {
                toast.success(result.message);
                setTimeout(()=>{
                    navigate('/dashboard');
                }, 1000);
            } else {
                toast.error(result.message + ` #${result.code}`);
                setIsFetch(false);
            }
        }

        fetchData();
    };


    const [wordCount, setWordCount] = useState(0);
    const contentValue = form.watch("content");
    useEffect(() => {
        setWordCount(contentValue.length);
    }, [contentValue]);


    return (
        <AuthLayout>
            <Head title="Dashboard" />
            <AppSidebar title="Dashboard">
                <Card className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <div className="grid grid-cols-6 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel>หัวข้อ</FormLabel>
                                            <FormControl>
                                                <Input placeholder="เพิ่มหัวข้อทีเด็ด" {...field} disabled={isFetch} />
                                            </FormControl>
                                            {!fieldState.error && (
                                                <FormDescription>
                                                    หัวข้อของโพสต์ ความยาวไม่เกิน 200 อักษร
                                                </FormDescription>
                                            )}

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="points"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2">
                                            <div className="flex items-center gap-1">
                                                <FormLabel>จำนวนพอยต์</FormLabel>
                                                <Dialog>
                                                    <DialogTrigger className="cursor-help px-1">
                                                        <CircleQuestionMark className="size-3" />
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>การกำหนดพอยต์สูงสุดตามระดับ Tier</DialogTitle>
                                                            <DialogDescription className="my-2" asChild>
                                                                <ul className="flex flex-col gap-2 list-disc ps-10">
                                                                    <li>Bronze : สูงสุก {(100).toLocaleString()} พอยต์</li>
                                                                    <li>Silver : สูงสุก {(1000).toLocaleString()}  พอยต์</li>
                                                                    <li>Gold   : สูงสุก {(100000).toLocaleString()}  พอยต์</li>
                                                                    <li>VIP    : สูงสุก {(10000000).toLocaleString()}  พอยต์</li>
                                                                </ul>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <FormControl>
                                                <Input type="number" placeholder="100-1,000,000" {...field} disabled={isFetch} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                            </FormControl>
                                            {!fieldState.error && (
                                                <FormDescription className="capitalize">
                                                    {user?.tier} จำนวนพอยต์สูงสุดอยู่ที่ {maxPoints.toLocaleString()} พอยต์
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Content */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>เนื้อหา</FormLabel>
                                            <Dialog>
                                                <DialogTrigger className="cursor-help px-1">
                                                    <CircleQuestionMark className="size-3" />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>เนื้อหาที่ถูกซ่อน</DialogTitle>
                                                        <DialogDescription className="my-2">
                                                            เนื้อหาส่วนนี้จะถูกซ่อนจากผู้ใช้งานกณีผู้ใช้ไม่ได้ปลดล็อกเนื้อหา
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <FormControl>
                                            <Textarea placeholder="Type your message here." {...field} disabled={isFetch} className="min-h-50 max-h-[50svh]" />
                                        </FormControl>
                                        <div className="flex justify-between">
                                            <div>
                                                {!fieldState.error && (
                                                    <FormDescription>
                                                    </FormDescription>
                                                )}
                                                <FormMessage />
                                            </div>
                                            <FormDescription>{wordCount}/3000</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2">
                                <Button type="submit" variant='default' onClick={() => form.setValue("submit", "private")} disabled={isFetch}>
                                    {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                    ร่าง
                                </Button>
                                <Button type="submit" variant='primary' onClick={() => form.setValue("submit", "public")} disabled={isFetch}>
                                    {isFetch && <LoaderCircle className="animate-spin size-4" />}
                                    สร้าง
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </AppSidebar>
        </AuthLayout >
    );
}



export function MaxPoints(i: string) {
    let max: number = 0;
    const tier = i.toLowerCase();
    switch (tier) {
        case 'bronze':
            max = 100;
            break;
        case 'silver':
            max = 1000;
            break;
        case 'gold':
            max = 10000;
            break;
        case 'vip':
            max = 1000000;
            break;
        default:
            max = 100;
    }

    return max;
}