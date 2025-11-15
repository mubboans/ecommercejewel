// hooks/useProductMutations.ts
import useSWR, { mutate } from 'swr';
import { IProduct } from '@/models/Product';

const API_BASE = '/api/products';

// Fetcher function for SWR
const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
};

export function useProductMutations(initialProducts?: IProduct[]) {
    const { data: products, error, isLoading } = useSWR<IProduct[]>(
        API_BASE,
        fetcher,
        {
            fallbackData: initialProducts, // Use server data as initial data
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    const deleteProduct = async (productId: string) => {
        try {
            // Optimistically update the cache
            const optimisticData = products?.filter(p => p._id !== productId) || [];
            mutate(API_BASE, optimisticData, false);

            const response = await fetch(`${API_BASE}/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            // Revalidate to get fresh data
            mutate(API_BASE);

            return;
        } catch (error) {
            // Revert on error
            mutate(API_BASE);
            throw error;
        }
    };

    const bulkDeleteProducts = async (productIds: string[]) => {
        try {
            // Optimistically update the cache
            const optimisticData = products?.filter(p => !productIds.includes(p._id)) || [];
            mutate(API_BASE, optimisticData, false);

            const deletePromises = productIds.map(id =>
                fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
            );

            const results = await Promise.allSettled(deletePromises);

            const failedDeletes = results.filter((result, index) =>
                result.status === 'rejected' || !result.value?.ok
            );

            if (failedDeletes.length > 0) {
                throw new Error(`Failed to delete ${failedDeletes.length} products`);
            }

            // Revalidate
            mutate(API_BASE);

            return { success: true, deletedCount: productIds.length };
        } catch (error) {
            mutate(API_BASE);
            throw error;
        }
    };

    return {
        products: products || [],
        isLoading,
        error,
        deleteProduct,
        bulkDeleteProducts,
    };
}