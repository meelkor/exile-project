declare module 'troika-three-text' {
    import * as three from 'three';

    export class Text extends three.Object3D {
        text: string;
        fontSize: number;
        font: string;
        color: three.ColorRepresentation;

        sync(): void;
        dispose(): void;
    }
}
