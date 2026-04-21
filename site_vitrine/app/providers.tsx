'use client';

import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from './lib/trackPageView';
import { startPresenceTracking } from './lib/trackPresence';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const stop = startPresenceTracking();
        return stop;
    }, []);

    useEffect(() => {
        if (pathname && !pathname.startsWith('/admin') && pathname !== '/login' && pathname !== '/register') {
            trackPageView(pathname);
        }
    }, [pathname]);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}
