import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "./ui/input-error"
import { useState } from "react"
import { Loader } from "lucide-react"
import { csrf } from "@/middlewares/CsrfMiddleware"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { usePage } from "@/hooks/usePage"
const API_URL: string = import.meta.env.VITE_API_URL;

const schema = z.object({
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน").min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema), // ✅ ใช้ zod validate
    });

    const [isFetch, setIsFetch] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (data: FormValues) => {
        const fetchData = async ()=>{
            setIsFetch(true);
            try {
                const csrfToken: any = await csrf();
                console.log(csrfToken);
                if (!csrfToken) {
                    throw new Error('Failed to get CSRF token');
                }
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        username: data.username,
                        password: data.password
                    })
                });

                if(res.status == 200){
                    const result = await res.json();
                    toast.success(result.message, {description: 'ลงชื่อเข้าใช้แล้ว รอสักครู่ระบบจะนำทางไปหน้าต่อไป'});
                    usePage.getState().fetchUser(true);
                    navigate("/home");
                }else{
                    const errors = await res.json();
                    console.log(errors);
                    setError('password', {message: errors.errors.password});
                    toast.error(errors.message, {description: errors.errors.password || errors.code || ''});

                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFetch(false);
            }
        };

        fetchData();
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Acme Inc account
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="เช่น johnny, milk@cow"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <InputError message={errors.username.message}/>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" placeholder="รหัสที่คุณลงทะเบียนไว้" {...register("password")} />
                                {errors.password && (
                                    <InputError message={errors.password.message}/>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isFetch}>
                                {isFetch && <Loader className="animate-spin" />}
                                Login
                            </Button>
                            
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/register" className="underline underline-offset-4">
                                    สมัครบัญชีผู้ใช้
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="https://ui.shadcn.com/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                โดยการคลิกดำเนินการต่อ คุณยอมรับ<a href="#">ข้อกำหนดในการให้บริการ</a>{" "}
                และ <a href="#">นโยบายความเป็นส่วนตัว</a>ของเรา.
            </div>
        </div>
    )
}

