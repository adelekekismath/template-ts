import { TimeModel } from "./TimeUnitsModel";


export class ClockModel {
    private hours: TimeModel;
    private minutes: TimeModel;
    private seconds: TimeModel;
    private timeZoneOffset: number;
    private amPmFormat: string = '';

    constructor(timeZoneOffset: number = 0) {
        this.timeZoneOffset = timeZoneOffset;
        const now = this.getTimeZoneOffset();
        this.hours = new TimeModel(now.getHours(), 23);
        this.minutes = new TimeModel(now.getMinutes(), 60);
        this.seconds = new TimeModel(now.getSeconds(), 60);
    }

    getHours(): number {
        return this.hours.get();
    }

    setHours(hours: number): void {
        this.hours = new TimeModel(hours, 23);
    }

    getMinutes(): number {
        return this.minutes.get();
    }

    setMinutes(minutes: number): void {
        this.minutes = new TimeModel(minutes, 60);
    }

    getSeconds(): number {
        return this.seconds.get();
    }

    setSeconds(seconds: number): void {
        this.seconds = new TimeModel(seconds, 60);
    }

    incrementHours(): void {
        this.hours = new TimeModel(this.hours.increment(), 23);
    }

    incrementMinutes(): void {
        this.minutes = new TimeModel(this.minutes.increment(), 60);
        if (this.minutes.get() === 0) {
            this.incrementHours();
        }
    }

    incrementSeconds(): void {
        this.seconds = new TimeModel(this.seconds.increment(), 60);
        if (this.seconds.get() === 0) {
            this.incrementMinutes();
        }
    }


    getTimeZoneOffset(): Date {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * this.timeZoneOffset));
    }
}
