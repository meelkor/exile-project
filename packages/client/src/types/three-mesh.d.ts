import * as three from 'three';

declare module '@types/three/src/objects/Mesh' {
    export interface Mesh {
        userData: {
            /**
             * ID of the TreeNode which "owns" the 3d object.
             */
            nodeId: number;
            /**
             * Whether object should be picked by raycasting -> mouse events. Is
             * set by ViewEvents service.
             */
            interactive?: boolean;
            /**
             * Optional object ID. Should only ever be generated using the
             * makeMeshObjectId helper fn.
             */
            objectId?: number;
            /**
             * Tags to query relevant meshes with.
             */
            tags?: Set<number>;
        },
    }
}
