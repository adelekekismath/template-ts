export enum TimeType {
    HOURS = 'hour',
    MINUTES = 'minute',
    SECONDS = 'second',
}

export abstract class ClockView {
    protected radius: number;
    constructor() {}

    abstract deleteClock(): void;

    abstract addEventToCloseButton(handleCloseButton: () => void): void;

    abstract makeDraggable(): void;
    abstract drawHandle(lengthRatio: number, angle: number, type: TimeType): void;
    abstract clear(): void;
    abstract blinkElement(type: TimeType): void;
    abstract stopBlinkElement(timeType: TimeType): void;
    abstract displayTime(time: string): void;
    abstract init(
        handleModeButton: () => void,
        handleIncreaseButton: () => void,
        handleResetButton: () => void,
        handleFormatButton: () => void
    ): void;
    getRadius(): number {
        return this.radius;
    }

    abstract drawClockFace(): void;
}
