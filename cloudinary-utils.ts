export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

export class CloudinaryService {
    static async uploadImage(file: File): Promise<CloudinaryUploadResult> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    }

    static async deleteImage(publicId: string): Promise<void> {
        // This would typically be done server-side due to API secret
        const response = await fetch('/api/upload/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicId }),
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }
    }

    static optimizeImage(url: string, transformations: string = 'w_500,h_500,c_fill,q_auto,f_auto'): string {
        if (!url.includes('cloudinary.com')) return url;

        return url.replace('/upload/', `/upload/${transformations}/`);
    }

    static getImageInfo(url: string) {
        if (!url.includes('cloudinary.com')) return null;

        const matches = url.match(/\/upload\/(.*)\/v\d+\/(.*)$/);
        return {
            transformations: matches?.[1] || '',
            publicId: matches?.[2] || ''
        };
    }
}