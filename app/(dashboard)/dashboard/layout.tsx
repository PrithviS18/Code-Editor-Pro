import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_component/DashboardSidebar";
import DashboardHeader from "./_component/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }:{ children: React.ReactNode}) {
    const session = await getServerSession(authOptions);
    if (!session){
        redirect('/login')
    }
    return (
        <SidebarProvider>
            {/*Sidebar left side */}
            <DashboardSidebar/>


            {/*All pages on right side*/}
            <main className="bg-secondary w-full">
                <DashboardHeader/>

                {children}
            </main>
        </SidebarProvider>
    )
}