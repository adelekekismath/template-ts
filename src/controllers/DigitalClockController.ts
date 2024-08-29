import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';
import { TimeType } from '../models/Type';

enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export class DigitalClockController extends ClockController {
    private isHoursEditable = false;
    private isMinutesEditable = false;
    private mode = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes
    private view: DigitalClockView;

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    protected initializeView(): void {
        this.view = new DigitalClockView();
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementHour();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinute();
        }
        this.updateTimeDisplay();
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

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.id));
    }

    handleResetButton(): void {
        this.model.resetToCurrentTime();
        this.updateTimeDisplay();
    }

    handleFormatButton(): void {
        this.format = this.format === Format.H24 ? Format.AM_PM : Format.H24;
        this.updateTimeDisplay();
    }

    private blink(timetype: TimeType): void {
        this.view.blinkElement(timetype);
        this.isHoursEditable = timetype === TimeType.HOURS;
        this.isMinutesEditable = timetype === TimeType.MINUTES;
    }

    private stopBlinking(): void {
        this.view.stopBlinkElement(TimeType.HOURS);
        this.view.stopBlinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = false;
    }

    private updateTimeDisplay(): void {
        this.view.displayTime(this.model.getCurrentTime(this.format));
    }

    protected initializeButonsEvents(): void {
        this.addEventListener(this.view.getLightButton(), 'click', () => this.view.toggleBackgroundColor());
        this.addEventListener(this.view.getIncreaseButton(), 'click', () => this.handleIncreaseButton());
        this.addEventListener(this.view.getModeButton(), 'click', () => this.handleModeButton());
        this.addEventListener(this.view.getResetButton(), 'click', () => this.handleResetButton());
        this.addEventListener(this.view.getFormatButton(), 'click', () => this.handleFormatButton());
    }

    startClock(): void {
        this.initializeView();
        this.initializeButonsEvents();
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.updateTimeDisplay();
        }, 1000);
    }

    deleteClock(): void {
        this.view.deleteClock();
    }

    drawClockFace(): void {
        throw new Error('Method not implemented.');
    }
}
