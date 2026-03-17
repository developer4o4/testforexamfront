'use client';
import { useContext } from 'react';
import { AccessContext } from '@/contexts/contexts';
import { usePathname } from 'next/navigation';
import NotFound from '../not-found';

export default function AdminLayout({ children }) {
    const { profileData } = useContext(AccessContext);
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/adminPanel');

    // if (isAdminRoute && (!profileData || !profileData.is_superuser)) {
    //     return <NotFound />;
    // }

    return <>{children}</>;
}
