/**
 * Wrap function with ID of its owner
 */
export interface SignedHandler<T extends Function> {
    handler: T;
    nodeId: number;
}
