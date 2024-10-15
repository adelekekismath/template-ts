import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';
import { TimeType, Format } from '../models/Type';

export class DigitalClockController extends ClockController {
    private isHoursEditable = false;
    private isMinutesEditable = false;
    private mode = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes
    private view!: DigitalClockView;

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    initializeView(): void {
        this.view = new DigitalClockView(this.getId(), this.model);
        this.view.initializeClock(this.model.getTimeUnit(TimeType.HOURS), this.model.getTimeUnit(TimeType.MINUTES), this.model.getTimeUnit(TimeType.SECONDS));
    }


    private blink(timeType: TimeType): void {
        this.view.blinkElement(timeType);
        this.isHoursEditable = timeType === TimeType.HOURS;
        this.isMinutesEditable = timeType === TimeType.MINUTES;
    }

    private stopBlinking(): void {
        this.view.stopBlinkElement(TimeType.HOURS);
        this.view.stopBlinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = false;
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementTimeUnit(TimeType.HOURS);
        } else if (this.isMinutesEditable) {
            this.model.incrementTimeUnit(TimeType.MINUTES);
        }
    }

    handleModeButton(): void {
        this.mode = (this.mode + 1) % 3;
        switch (this.mode) {
            case 1:
                this.blink(TimeType.HOURS);
                break;
            case 2:
                this.stopBlinking();
                this.blink(TimeType.MINUTES);
                break;
            default:
                this.stopBlinking();
        }
    }

    handleResetButton(): void {
        this.resetClock();
    }

    handleFormatButton(): void {
        this.view.toggleFormat();
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.getId()));
    }

    protected initializeButonsEvents(): void {
        this.addEventListener(this.view.getLightButton(), 'click', () => this.view.toggleBackgroundColor());
        this.addEventListener(this.view.getIncreaseButton(), 'click', () => this.handleIncreaseButton());
        this.addEventListener(this.view.getModeButton(), 'click', () => this.handleModeButton());
        this.addEventListener(this.view.getResetButton(), 'click', () => this.handleResetButton());
        this.addEventListener(this.view.getFormatButton(), 'click', () => this.handleFormatButton());
        this.view.makeDraggable();
    }

    startClock(): void {
        this.initializeButonsEvents();
        setInterval(() => {
            this.tick();
            this.incrementHours = false;
            this.incrementMinutes = false;
        }, 1000);
    }

    deleteClock(): void {
        this.view.deleteClock();
    }
}
