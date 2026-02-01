import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '@/config/seo.config';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    noindex?: boolean;
    keywords?: string[];
    image?: string;
    type?: 'website' | 'article' | 'profile';
}

const SEO = ({
    title,
    description,
    canonical,
    noindex = false,
    keywords = [],
    image,
    type = 'website',
}: SEOProps) => {
    const siteUrl = SEO_CONFIG.url;
    const fullTitle = title
        ? SEO_CONFIG.titleTemplate.replace('%s', title)
        : SEO_CONFIG.titleDefault;
    const metaDescription = description || SEO_CONFIG.description;
    const metaImage = image ? `${siteUrl}${image}` : SEO_CONFIG.openGraph.images[0].url;
    const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta charSet="utf-8" />
            <meta name="theme-color" content="#3b82f6" /> {/* Example primary color */}

            {/* Robots */}
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
            {noindex && <meta name="googlebot" content="noindex, nofollow" />}

            {/* Keywords (Optional but requested) */}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Language */}
            <html lang="en" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={SEO_CONFIG.siteName} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content={SEO_CONFIG.twitter.cardType} />
            <meta name="twitter:site" content={SEO_CONFIG.twitter.site} />
            <meta name="twitter:creator" content={SEO_CONFIG.twitter.handle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: SEO_CONFIG.siteName,
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web',
                    url: siteUrl,
                    description: SEO_CONFIG.description,
                    offers: {
                        '@type': 'Offer',
                        price: '0',
                        priceCurrency: 'USD',
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: SEO_CONFIG.siteName,
                        logo: {
                            '@type': 'ImageObject',
                            url: `${siteUrl}/logo.png`
                        }
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
