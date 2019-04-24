export interface Pilot {
    id: number;
    firstName: string;
    lastName: string;
}

export interface Aircraft {
    id: number;
    operational: boolean;
}

export interface Availability {
    pilotId: number;
    timeCreated: number;
}

export interface Flight {
    id: number;
    pilotId: number;
    aircraftId: number;
    zoneId: number;
    started: boolean;
    completed: boolean;
}