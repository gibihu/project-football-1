
import { Head } from "@/components/app-head";
import NavBar from "@/components/nav-bar";
import AppLayout from "@/layout/app-layout";
import { useEffect } from "react";
import { MatchDashboard } from "./match-dashboard";
import FeedEpic from "./feed";
import { usePage } from "@/hooks/usePage";
import { LiveScore } from "./match/live-score";
const API_URL: string = import.meta.env.VITE_API_URL;
// console.log(import.meta.env.VITE_API_URL)


export default function Home() {

    const { user, loading, error } = usePage();
    console.log(user, loading, error);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(API_URL);
            const data = await res.json();
            console.log(data);
        }

        // fetchData();
    },[]);


    return (
        <AppLayout>
            <Head title="Home" />
            <NavBar />

            <div className="flex flex-col gap-4  mt-4">
                <LiveScore />
                {/* <MatchDashboard /> */}
                <FeedEpic />
            </div>
        </AppLayout>
    );
}