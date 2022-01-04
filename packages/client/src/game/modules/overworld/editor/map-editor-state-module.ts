import { StateModule } from '@exile/client/engine/store/state-module';
import { MapEditorTool } from '@exile/client/game/modules/overworld/editor/map-editor-tool';
import { OverhexObject } from '@exile/client/game/modules/overworld/map/overhex/overhex-object';
import { DebugName } from '@exile/common/utils/debug/class';

@DebugName('MapEditorStateModule')
export class MapEditorStateModule extends StateModule<MapEditorState, MapEditorEvent, MapEditorPayloads> {

    /// Actions ///

    public addObject(obj: OverhexObject): void {
        this.state.objects.push(obj);

        this.emit(MapEditorEvent.ObjectAdded, obj);
    }

    public setTool(tool: MapEditorTool): void {
        this.state.currentTool = tool;
        this.emit(MapEditorEvent.ToolChanged, tool);
    }

    public setActiveObject(objId?: number): void {
        this.state.activeObject = objId;
        this.emit(MapEditorEvent.ActiveObjectChanged, objId);
    }
}

export interface MapEditorState {
    objects: OverhexObject[];
    currentTool: MapEditorTool;
    activeObject?: number;
}

export enum MapEditorEvent {
    ObjectAdded,
    ToolChanged,
    ActiveObjectChanged,
}

interface MapEditorPayloads {
    [MapEditorEvent.ObjectAdded]: OverhexObject;
    [MapEditorEvent.ToolChanged]: MapEditorTool;
    [MapEditorEvent.ActiveObjectChanged]: number | undefined;
}
