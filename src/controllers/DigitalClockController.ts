/**
 * This class processes button inputs and updates the model and triggers the view to re-render.
 */

import { ClockModel } from '../models/ClockModel';
import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';
import { TimeType } from '../views/ClockView';


enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export class DigitalClockController extends ClockController {
    public id: number;
    private isHoursEditable: boolean = false;
    private isMinutesEditable: boolean = false;
    private mode: number = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    protected initializeView(): void {
        this.view = new DigitalClockView()
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementHour();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinute();
        }
    }

    displayCurrentTime() {
        return this.model.getCurrentTime(this.format);
    }

    deleteClock() {
        this.view.deleteClock();
    }

    drawClockFace(): void{
        throw new Error('Method not implemented.');
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
    }

    handleFormatButton() {
        this.format = this.format === Format.H24 ? Format.AM_PM : Format.H24;
        console.log(this.format);    }

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
        this.initializeView();
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