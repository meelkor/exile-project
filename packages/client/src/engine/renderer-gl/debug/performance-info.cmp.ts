import { Component } from '@exile/client/engine/component/component';
import { Gl } from '@exile/client/engine/renderer-gl/internal/gl';

export class PerformanceInfo extends Component {

    private readonly gl = this.inject(Gl);

    private valueElements: Record<string, HTMLElement> = {};

    public actions = {};

    public onInit(): void {
        const cont = document.createElement('div');

        cont.style.position = 'absolute';
        cont.style.right = '0';
        cont.style.top = '0';
        cont.style.background = 'black';
        cont.style.fontFamily = 'monospace';
        cont.style.fontSize = '12px';
        cont.style.color = 'white';
        cont.style.padding = '4px';

        this.valueElements.draws = this.makeRow(cont, 'Draws');
        this.valueElements.geometries = this.makeRow(cont, 'Geometries');
        this.valueElements.textures = this.makeRow(cont, 'Textures');
        this.valueElements.triangles = this.makeRow(cont, 'Triangles');

        document.body.append(cont);
    }

    public onTick(): void {
        const info = this.gl.renderer.info;

        this.valueElements.draws!.innerText = info.render.calls.toString();
        this.valueElements.triangles!.innerText = info.render.triangles.toString();
        this.valueElements.geometries!.innerText = info.memory.geometries.toString();
        this.valueElements.textures!.innerText = info.memory.textures.toString();
    }

    private makeRow(container: HTMLElement, name: string): HTMLElement {
        const row = document.createElement('div');
        row.innerText = `${name}: `;

        const rowVal = document.createElement('span');
        row.append(rowVal);

        container.append(row);

        return rowVal;
    }
}
