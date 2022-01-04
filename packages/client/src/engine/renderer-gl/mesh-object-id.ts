let counter = 0;

/**
 * Create ID to use as objectId in mesh's userData.
 */
export function getMeshObjectId(): number {
    return counter++;
}
