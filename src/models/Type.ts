export enum TimeType {
    HOURS = 'hours',
    MINUTES = 'minutes',
    SECONDS = 'seconds',
}

export type Position = {
    x: number;
    y: number;
};

export enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export enum ClockType {
    ANALOG,
    DIGITAL,
}
