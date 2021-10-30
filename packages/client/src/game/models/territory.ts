export interface Territory {
    id: number;
    x: number;
    y: number;
    claim: ClaimState;
    slots: BuildingSlot[];
}

export interface BuildingSlot {
    // todo
    type: number;
    building: any;
}

export enum ClaimState {
    Unknown,
    Scoutable,
    Guarded,
    Free,
    Blocked,
}
