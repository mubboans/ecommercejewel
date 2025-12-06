/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    quality?: number;
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    fill = false,
    sizes,
    quality = 85,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Optimize Cloudinary URLs
    const optimizeSrc = (url: string) => {
        if (url.includes('cloudinary.com')) {
            // Add Cloudinary transformations for better performance
            return url.replace('/upload/', '/upload/f_auto,q_auto:good,c_limit/');
        }
        return url;
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    if (error) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted text-muted-foreground',
                    className
                )}
                style={fill ? undefined : { width, height }}
            >
                <span className="text-xs">Failed to load image</span>
            </div>
        );
    }

    return (
        <div className={cn('relative overflow-hidden', className)}>
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <Image
                src={optimizeSrc(src)}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                className={cn(
                    'transition-opacity duration-300',
                    isLoading ? 'opacity-0' : 'opacity-100',
                    className
                )}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
}
