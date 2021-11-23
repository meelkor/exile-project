import { OverhexObjectType } from '@exile/client/game/modules/overworld/map/overhex/overhex-object';

export type MapEditorTool = ParamlessMapEditorTool | PlaceMapEditorTool;

interface PlaceMapEditorTool {
    name: MapEditorToolType.Place;
    param: OverhexObjectType;
}

interface ParamlessMapEditorTool {
    name: MapEditorToolType.Pan;
    param?: never;
}

export enum MapEditorToolType {
    Pan,
    Place,
}

export function editorToolUuid(tool: MapEditorTool): string {
    return `${tool.name}|${tool.param ?? ''}`;
}
