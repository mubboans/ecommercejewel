import { Cloudinary } from '@cloudinary/url-gen';

// Client-side configuration (safe to expose)
export const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    url: {
        secure: true
    }
});

// Server-side configuration (for API routes)
export const cloudinaryConfig = {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};