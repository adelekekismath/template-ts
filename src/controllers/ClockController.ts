import { ClockModel } from '../models/ClockModel';
import { TimeType } from '../models/Type';

export abstract class ClockController {
    private id: number;
    protected model: ClockModel;
    protected incrementHours = false;
    protected incrementMinutes = false;

    private static readonly UNIQUE_ID_OFFSET = 1000;

    constructor(protected timezoneOffset: number) {
        this.model = new ClockModel(this.timezoneOffset);
        this.id = this.generateUniqueId();
    }


    protected resetClock(): void {
        const now = new Date();
        this.model = new ClockModel(this.timezoneOffset);
    }
    protected abstract handleIncreaseButton(): void;
    protected abstract handleModeButton(): void;

    abstract addEventToCloseButton(removeClock: (clockNumber: number) => void): void;

    protected addEventListener(element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject): void {
        element.addEventListener(type, listener);
    }

    protected generateUniqueId(): number {
        return Date.now() + Math.floor(Math.random() * ClockController.UNIQUE_ID_OFFSET);
    }


    protected setMinutes(minutes: number): void {
        this.model.setTimeUnit(TimeType.MINUTES, minutes);
        const hours = Math.floor(minutes / 60);
        this.model.setTimeUnit(TimeType.HOURS, hours);
    }

    tick(): void {
        this.model.incrementTimeUnit(TimeType.SECONDS);
    }

    abstract initializeView(): void;
    abstract startClock(): void;
    getId(): number {
        return this.id;
    }
    abstract deleteClock(): void;
}
