import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_component/DashboardSidebar";
import DashboardHeader from "./_component/DashboardHeader";

export default function DashboardLayout({ children }:{ children: React.ReactNode}) {
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