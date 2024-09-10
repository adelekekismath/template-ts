import { ClockModel } from '../models/ClockModel';
import { Format } from '../models/Type';

export abstract class ClockController {
    private id: number;
    protected model: ClockModel;
    protected incrementHours = false;
    protected incrementMinutes = false;
    protected format: Format = Format.H24;

    private static readonly UNIQUE_ID_OFFSET = 1000;

    constructor(protected timezoneOffset: number) {
        this.model = new ClockModel(timezoneOffset);
        this.id = this.generateUniqueId();
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

    abstract initializeView(): void;
    abstract startClock(): void;
    getId(): number {
        return this.id;
    }
    abstract deleteClock(): void;
    abstract makeDraggable(): void;
}
