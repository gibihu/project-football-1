import { usePage } from "@/hooks/usePage";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL: string = import.meta.env.VITE_API_URL;


export default function Logout(){
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchData = async () => {
            const res = await fetch(`${API_URL}/logout`);
            console.log(res);
            usePage.getState().fetchUser(true);
            navigate("/home");
        }
        fetchData();
    });

    return (
        <>
            <Link to="/">
            Home
            </Link>
        </>
    );
}