export enum TimeType {
    HOURS = 'hours',
    MINUTES = 'minutes',
    SECONDS = 'seconds',
}

export class Position  {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    equals(pos: Position): boolean {
        return this.x === pos.x && this.y === pos.y;
    }
};

export enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export enum ClockType {
    ANALOG,
    DIGITAL,
}
