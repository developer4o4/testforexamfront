// components/HeaderSwitcher.js
"use client";

import { usePathname } from "next/navigation";
import Header from "../publicHeader/header";
import AdminHeader from "@/app/adminPanel/admin-header/admin-header";
export default function HeaderSwitcher() {
    const pathname = usePathname();

    if (pathname?.startsWith('/adminPanel')) {
        return <AdminHeader />;
    }

    return <Header />;
}