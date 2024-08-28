
import { ClockModel } from '../models/ClockModel';
import { ClockView } from '../views/ClockView';

export enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export abstract class ClockController {
    public id: number;
    protected model: ClockModel;
    protected incrementHours: boolean = false;
    protected incrementMinutes: boolean = false;
    protected format: Format = Format.H24;
    protected view: ClockView;

    constructor(protected timezoneOffset: number) {
        this.model = new ClockModel(timezoneOffset);
        this.id = this.generateUniqueId();
    }

    protected abstract handleIncreaseButton(): void;
    protected abstract handleModeButton(): void;

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.view.addEventToCloseButton(() => removeClock(this.id));
    }

    protected generateUniqueId(): number {
        return Date.now() + Math.floor(Math.random() * 1000);
    }
    protected abstract initializeView(): void;

    protected abstract startClock(): void;
    abstract deleteClock(): void;
}
