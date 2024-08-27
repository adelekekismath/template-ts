/**
 * This class processes button inputs and updates the model and triggers the view to re-render.
 */

import { WatchModel } from '../models/WatchModel';
import { WatchView } from '../views/WatchView';
enum TimeType {
    HOURS,
    MINUTES,
}
enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export class WatchController {
    public id: number;
    private model: WatchModel;
    private view: WatchView;
    private isHoursEditable: boolean = false;
    private isMinutesEditable: boolean = false;
    private incrementHours: boolean = false;
    private incrementMinutes: boolean = false;
    private format: Format = Format.H24;
    private mode: number = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes

    constructor(timezoneOffset: number) {
        this.model = new WatchModel(timezoneOffset);
        this.view = new WatchView();
        this.id = this.view.id;
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementHour();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinute();
        }
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void) {
        this.view.addEventToCloseButton(() => removeClock(this.id));
    }

    displayCurrentTime() {
        return this.model.getCurrentTime(this.format);
    }

    handleModeButton() {
        this.mode = (this.mode + 1) % 3;

        switch (this.mode) {
            case 0:
                this.stopBlinking();
                break;
            case 1:
                this.blinkHours();
                break;
            case 2:
                this.stopBlinking();
                this.blinkMinutes();
                break;
        }
    }

    handleResetButton() {
        this.model.resetToCurrentTime();
        //this.view.displayTime(this.model.getCurrentTime(), this.format);
    }

    handleFormatButton() {
        this.format = this.format === Format.H24 ? Format.AM_PM : Format.H24;
    }

    blinkHours() {
        this.view.blinkElement(TimeType.HOURS);
        this.isHoursEditable = true;
        this.isMinutesEditable = false;
    }

    blinkMinutes() {
        this.view.blinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = true;
    }

    stopBlinking() {
        this.view.stopBlinkElement(TimeType.HOURS);
        this.view.stopBlinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = false;
    }

    startClock() {
        this.view.init(
            () => this.handleModeButton(),
            () => this.handleIncreaseButton(),
            () => this.handleResetButton(),
            () => this.handleFormatButton()
        );
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.view.displayTime(this.model.getCurrentTime(this.format));
        }, 1000);
    }
}