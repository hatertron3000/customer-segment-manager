import { Box, Tabs } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const TabIds = {
    SEGMENTS: 'segments',
    CUSTOMERS: 'customers',
};

export const TabRoutes = {
    [TabIds.SEGMENTS]: '/',
    [TabIds.CUSTOMERS]: '/customers',
};

const Header = () => {
    const [activeTab, setActiveTab] = useState<string>('');
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
        // Check if new route matches TabRoutes
        const tabKey = Object.keys(TabRoutes).find(key => TabRoutes[key] === pathname);

        // Set the active tab to tabKey or set no active tab if route doesn't match (404)
        setActiveTab(tabKey ?? '');
    }, [pathname]);

    useEffect(() => {
        // Prefetch segments page to reduce latency (doesn't prefetch in dev)
        router.prefetch('/');
    });

    const items = [
        { id: TabIds.SEGMENTS, title: 'Segments' },
        { id: TabIds.CUSTOMERS, title: 'Customers' },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);

        return router.push(TabRoutes[tabId]);
    };

    return (
        <Box marginBottom="xxLarge">
            <Tabs
                activeTab={activeTab}
                items={items}
                onTabClick={handleTabClick}
            />
        </Box>
    );
};

export default Header;
