/**
 * This class manages the current time and provides methods to edit hours and minutes
 */

import { HourWrapper, MinuteWrapper, SecondWrapper } from '../example-unit';

export class WatchModel {
    private hours: HourWrapper;
    private minutes: MinuteWrapper;
    private seconds: SecondWrapper;

    constructor() {
        const now = new Date();
        this.hours = new HourWrapper(now.getHours());
        this.minutes = new MinuteWrapper(now.getMinutes());
        this.seconds = new SecondWrapper(now.getSeconds());
    }

    getCurrentTime(): string {
        return `${this.formatTime(this.hours.get())}:${this.formatTime(this.minutes.get())}:${this.formatTime(this.seconds.get())}`;
    }
    
    incrementHour() {
        const newHour = this.hours.incrementHour();
        this.hours = new HourWrapper(newHour);
    }

    incrementMinute() {
        const newMinute = this.minutes.incrementMinute();
        this.minutes = new MinuteWrapper(newMinute);
    }

    tick() {
        const newSecond = this.seconds.incrementSecond();
        this.seconds = new SecondWrapper(newSecond);

        if (newSecond === 0) {
            const newMinute = this.minutes.incrementMinute();
            this.minutes = new MinuteWrapper(newMinute);

            if (newMinute === 0) {
                const newHour = this.hours.incrementHour();
                this.hours = new HourWrapper(newHour);
            }
        }
    }

    private formatTime(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
