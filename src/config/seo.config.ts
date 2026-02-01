export const SEO_CONFIG = {
    siteName: 'MediX',
    titleDefault: 'MediX - Pharmacy POS & Management Software',
    titleTemplate: '%s | MediX',
    description: 'MediX is a comprehensive pharmacy POS and management solution. Manage inventory, billing, customers, and analytics efficiently.',
    url: 'https://medix.com', // TODO: Update with actual production URL
    twitter: {
        handle: '@medix',
        site: '@medix',
        cardType: 'summary_large_image',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://medix.com',
        site_name: 'MediX',
        images: [
            {
                url: 'https://medix.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'MediX Pharmacy POS',
            },
        ],
    },
    routes: {
        home: '/',
        features: '/features',
        pricing: '/pricing',
        contact: '/contact',
        about: '/about',
        login: '/login',
        register: '/register',
        dashboard: '/dashboard',
    },
};
