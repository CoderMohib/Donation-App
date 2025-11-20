/**
 * Async error handler wrapper
 * Returns a tuple of [data, error]
 */
export async function asyncHandler<T>(
    promise: Promise<T>
): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (err) {
        return [null, err as Error];
    }
}

/**
 * Async handler with loading state callback
 */
export async function asyncHandlerWithLoading<T>(
    promise: Promise<T>,
    setLoading: (loading: boolean) => void
): Promise<[T | null, Error | null]> {
    setLoading(true);
    const result = await asyncHandler(promise);
    setLoading(false);
    return result;
}
