import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { usePage } from "@/hooks/usePage";
import { CirclePoundSterling, LoaderCircle } from "lucide-react";


const API_NAME: string = import.meta.env.VITE_API_NAME;

export default function NavBar(){

    const { user, loading } = usePage();

    function handlReloadSession(){
        usePage.getState().fetchUser(true);
    }
    
    return (
        <>
            <div className="w-full flex gap-2 justify-between items-center rounded-xl bg-foreground text-background  shadow-xl p-4">
                <h4 className="text-xl capitalize">{API_NAME}</h4>
                <div className="flex gap-2 items-center">
                    {!loading ? user ? (
                        user.role && (
                            <>
                                <div className="flex gap-2">
                                    <Button variant='ghost' onClick={handlReloadSession}>
                                        <CirclePoundSterling className="size-4 text-yellow-600" />
                                        <span>{user.wallet.points.toLocaleString()}</span>
                                    </Button>
                                </div>
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