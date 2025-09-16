import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { usePage } from "@/hooks/usePage";
import { LoaderCircle } from "lucide-react";


const API_NAME: string = import.meta.env.VITE_API_NAME;

export default function NavBar(){

    const { user, loading } = usePage();
    
    return (
        <>
            <div className="w-full flex gap-2 justify-between items-center rounded-xl bg-foreground text-background  shadow-xl p-4">
                <h4 className="text-xl capitalize">{API_NAME}</h4>
                <div className="flex gap-2 items-center">
                    {!loading ? user ? (
                        user.role && (
                            <>
                                <Link to="/dashboard"><Button>Dashboard</Button></Link>
                                <Link to="/logout"><Button>ออระบบ</Button></Link>
                            </>
                        )
                    ) : (
                        <Link to="/login"><Button>Sign in</Button></Link>
                    ) : <Button variant="ghost" className="p-0"><LoaderCircle className="size-6 animate-spin" /></Button>}
                </div>
            </div>
        </>
    );
}