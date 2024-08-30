import { HourManager, MinuteManager, SecondManager } from './TimeManager';

enum Format {
    AM_PM = 'AM_PM',
    H24 = 'H24',
}

export class ClockModel {
    private hours: HourManager;
    private minutes: MinuteManager;
    private seconds: SecondManager;
    private currentFormat: Format = Format.H24;
    private timeZoneOffset: number;
    private amPmFormat: string = '';

    constructor(timeZoneOffset: number = 0) {
        this.timeZoneOffset = timeZoneOffset;
        const now = this.getTimeWithOffset();
        this.hours = new HourManager(now.getHours());
        this.minutes = new MinuteManager(now.getMinutes());
        this.seconds = new SecondManager(now.getSeconds());
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
        this.currentFormat = format;
        const hours = this.formatTime(this.hours.get(), format);
        const minutes = this.formatTime(this.minutes.get());
        const seconds = this.formatTime(this.seconds.get());
        const amPm = format === Format.AM_PM ? this.amPmFormat : '';
        return `${hours}:${minutes}:${seconds} ${amPm}`;
    }

    incrementHour(): void {
        this.hours = new HourManager(this.hours.incrementHour());
    }

    incrementMinute(): void {
        this.minutes = new MinuteManager(this.minutes.incrementMinute());
    }

    tick(incrementHours: boolean, incrementMinutes: boolean): void {
        this.seconds = new SecondManager(this.seconds.incrementSecond());

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
        this.hours = new HourManager(now.getHours());
        this.minutes = new MinuteManager(now.getMinutes());
        this.seconds = new SecondManager(now.getSeconds());
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
