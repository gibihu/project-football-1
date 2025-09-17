import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePage } from "@/hooks/usePage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BanknoteArrowUp, CirclePoundSterling, Package, UsersRound, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb";

// This is sample data.

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    title?: string
};

export function AppSidebar({ title, children, ...props }: AppSidebarProps) {
    const { user } = usePage();
const data = {
    navMain: [
        {
            title: "Getting Started",
            href: "#",
            role: '',
            items: [
                {
                    title: "Wallet",
                    href: "/wallet",
                    icon: Wallet
                },
                {
                    title: "Points",
                    href: "/pack-point",
                    icon: CirclePoundSterling
                },
            ],
        },
        {
            title: "Workspace",
            href: "#",
            role: 'admin',
            items: [
                // {
                //     title: "Packages",
                //     href: "/packages",
                //     icon: Package
                // },
                {
                    title: "Users",
                    href: "/users",
                    isActive: true,
                    icon: UsersRound
                },
                {
                    title: "เงินเข้า",
                    href: "/user/payment",
                    isActive: true,
                    icon: BanknoteArrowUp
                },
            ],
        },
    ],
}

    return (
        <SidebarProvider {...props}>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <Avatar className="rounded-md" >
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback className="uppercase">{user?.username.charAt(0)}{user?.username.charAt(2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-medium">{user?.name}</span>
                                        <span className="text-ring">@{user?.username}</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    {/* We create a SidebarGroup for each parent. */}
                    {data.navMain.map((item) => {
                        if(item.role == '' || item.role == 'user') {item.role = user?.role || ''}
                        
                        if(item.role == user?.role){
                            return (
                                <SidebarGroup key={item.title}>
                                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {item.items.map((item) => (
                                                <SidebarMenuItem key={item.title}>
                                                    <Link to={item.href}>
                                                        <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                                                            {item.icon && <item.icon />}
                                                            <span>{item.title}</span>
                                                        </SidebarMenuButton>
                                                    </Link>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            );
                        }
                    })}
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    {title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
