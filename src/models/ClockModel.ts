import { HourModel, MinuteModel, SecondModel } from "./TimeUnitsModel";

enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export class ClockModel {
    private hours: HourModel;
    private minutes: MinuteModel;
    private seconds: SecondModel;
    private timeZoneOffset: number;
    private amPmFormat: string = '';

    constructor(timeZoneOffset: number = 0) {
        this.timeZoneOffset = timeZoneOffset;
        const now = this.getTimeWithOffset();
        this.hours = new HourModel(now.getHours());
        this.minutes = new MinuteModel(now.getMinutes());
        this.seconds = new SecondModel(now.getSeconds());
    }

    getHours(): number {
        return this.hours.get();
    }

    getMinutes(): number {
        return this.minutes.get();
    }

    getSeconds(): number {
        return this.seconds.get();
    }

    getCurrentTime(format: Format): string {
        const hours = this.formatTime(this.hours.get(), format);
        const minutes = this.formatTime(this.minutes.get());
        const seconds = this.formatTime(this.seconds.get());
        const amPm = format === Format.AM_PM ? this.amPmFormat : '';
        return `${hours}:${minutes}:${seconds} ${amPm}`;
    }

    incrementHour(): void {
        this.hours = new HourModel(this.hours.increment());
    }

    incrementMinute(): void {
        this.minutes = new MinuteModel(this.minutes.increment());
    }

    tick(incrementHours: boolean, incrementMinutes: boolean): void {
        this.seconds = new SecondModel(this.seconds.increment());

        if (this.seconds.get() === 0) {
            this.incrementMinute();
            if (this.minutes.get() === 0) {
                this.incrementHour();
            }
        }

        if (incrementMinutes) {
            this.incrementMinute();
        }

        if (incrementHours) {
            this.incrementHour();
        }
    }

    resetToCurrentTime(): void {
        const now = this.getTimeWithOffset();
        this.hours = new HourModel(now.getHours());
        this.minutes = new MinuteModel(now.getMinutes());
        this.seconds = new SecondModel(now.getSeconds());
    }

    private getTimeWithOffset(): Date {
        const time = new Date();
        time.setHours(time.getUTCHours() + this.timeZoneOffset);
        return time;
    }

    private formatTime(value: number, format?: Format): string {
        if (format === Format.AM_PM) {
            this.amPmFormat = value >= 12 ? 'PM' : 'AM';
            value = value > 12 ? value - 12 : value;
        }
        return value < 10 ? `0${value}` : `${value}`;
    }
}
