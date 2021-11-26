import { Component } from '@exile/client/engine/component/component';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import dialogBgUrl from '@exile/client/resources/textures/ui/panel-bg.png';
import * as three from 'three';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

export class AdvUiCmp extends Component {

    public actions = {};

    private uiPlane = this.inject(UiPlane);

    constructor() {
        super();
    }

    protected onInit(): void {
        const width = this.uiPlane.getWidth('100%');
        const height = this.uiPlane.bottom(200);

        const plane = new three.PlaneBufferGeometry(width, height, 1, 1);
        const texture = this.loader.load(dialogBgUrl);

        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.RepeatWrapping;

        texture.repeat.set(width / 512, height / 512);

        const material = new three.MeshBasicMaterial({
            map: texture,
            opacity: 0.96,
            transparent: true,
        });

        const mesh = new NodeMesh(plane, material, true);

        mesh.position.set(
            width / 2,
            height / 2,
            1,
        );

        this.io.add(PlaneName.Ui, mesh);
    }

    protected override onDestroy(): void {
        super.onDestroy();
    }

    protected onTick(_hrt: number): void {
        /** noop */
    }
}
