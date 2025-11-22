/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['mongoose'],
    images: {
        domains: ['res.cloudinary.com', 'images.unsplash.com'],
    },
    // Important for NextAuth
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;