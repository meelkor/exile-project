import * as three from 'three';
import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { OverhexStyle } from '@exile/client/game/modules/overworld/map/overhex/overhex-style';
import { ButtonViewInfo, ViewEvent, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { Store } from '@exile/client/engine/store/store';
import { MapEditorEvent, MapEditorStateModule } from '@exile/client/game/modules/overworld/editor/map-editor-state-module';
import { OverhexObjectType } from '@exile/client/game/modules/overworld/map/overhex/overhex-object';
import { EditorButtonCmp } from '@exile/client/game/modules/overworld/editor/editor-ui/editor-button.cmp';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { Glyph } from '@exile/client/resources/fonts/icons';
import { EditorButtonBarCmp } from '@exile/client/game/modules/overworld/editor/editor-ui/editor-button-bar.cmp';
import { editorToolUuid, MapEditorTool, MapEditorToolType as MapEditorToolName } from '@exile/client/game/modules/overworld/editor/map-editor-tool';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';
import { TAG_OVERHEX_OBJECT } from '@exile/client/game/modules/overworld/map/overhex/overhex-tags';

/**
 * Component displaying overlay for editing overhex-style maps
 */
export class MapEditorCmp extends Component {

    private uiPlane = this.inject(UiPlane);

    private overhexStyle = this.inject(OverhexStyle);

    private store = this.inject(Store);

    private state = this.store.require(MapEditorStateModule);

    private buttonBar: EditorButtonBarCmp;

    public actions = {};

    constructor() {
        super();

        this.buttonBar = this.instantiate(EditorButtonBarCmp);

        this.buttonBar.update({
            position: {
                x: 8,
                y: this.uiPlane.top(8),
            },
        });

        const toolConfigs = this.prepareToolConfigs([
            {
                name: MapEditorToolName.Pan,
                icon: Glyph.Pointer,
            },
            {
                name: MapEditorToolName.Place,
                param: OverhexObjectType.Mountain,
                icon: Glyph.Mountains,
            },
        ]);


        for (const { tool, id, icon } of toolConfigs) {
            const button = this.instantiate(EditorButtonCmp).update({
                icon,
                onClick: () => this.state.setTool(tool),
            });

            this.buttonBar.addButton(id, button);
        }

        this.updateActiveTool(this.state.getState().currentTool);
    }

    public onInit(): void {
        this.createButtons();
        this.createTrap();
    }

    public onTick(): void { /* noop */ }

    private prepareToolConfigs(tools: MapEditorToolInput[]): MapEditorToolButtonConfig[] {
        return tools.map(tool => ({
            id: editorToolUuid(tool),
            tool: {
                name: tool.name,
                param: tool.param,
            } as MapEditorTool,
            icon: tool.icon,
        }));
    }

    private createButtons(): void {
        this.add(this.buttonBar);
    }

    private createTrap(): void {
        const trapGeometry = new three.PlaneBufferGeometry(1000, 1000, 1, 1);
        const mesh = new NodeMesh(trapGeometry, undefined, true);

        mesh.visible = false;
        mesh.position.set(0, 0, this.overhexStyle.territoryHeight / 2 + 0.001);

        this.io.add(PlaneName.World, mesh);

        this.io.onInput(ViewEventType.Click, this.handleClick);
        this.state.on(MapEditorEvent.ToolChanged, this.updateActiveTool);

        let visibleEdges: three.LineSegments | undefined;

        this.io.queryInput(ViewEventType.MouseIn, {
            tags: [TAG_OVERHEX_OBJECT],
        }, (e) => {
            const edges = new three.EdgesGeometry(e.mesh.geometry);
            const lineMat = new three.LineBasicMaterial({ color: 0xffffff });
            lineMat.transparent = true;
            visibleEdges = new three.LineSegments(edges, new three.LineBasicMaterial({ color: 0xffffff }));
            visibleEdges.scale.copy(e.mesh.scale);
            visibleEdges.position.copy(e.mesh.position);
            this.io.add(PlaneName.World, visibleEdges);
        });

        this.io.queryInput(ViewEventType.MouseOut, {
            tags: [TAG_OVERHEX_OBJECT],
        }, () => {
            if (visibleEdges) {
                this.io.remove(PlaneName.World, visibleEdges);
            }
        });
    }

    private updateActiveTool = (tool: MapEditorTool): void => {
        this.buttonBar.setActive(editorToolUuid(tool));
    }

    private handleClick = ({ info }: ViewEvent<ButtonViewInfo>): void => {
        const tool = this.state.getState().currentTool;

        if (tool.name === MapEditorToolName.Place) {
            this.state.addObject({
                pos: info.pos,
                type: tool.param,
            });
        }
    };
}

type MapEditorToolInput = MapEditorTool & {
    icon: string;
}

interface MapEditorToolButtonConfig {
    id: string;
    icon: string;
    tool: MapEditorTool;
}
