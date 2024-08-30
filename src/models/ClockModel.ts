/**
 * This class manages the current time and provides methods to edit hours and minutes
 */

import { HourManager, MinuteManager, SecondManager } from '../example-unit';
enum Format {
    AM_PM = 'AM_PM',
    H24= 'H24',
}
export class ClockModel {
    private hours: HourManager;
    private minutes: MinuteManager;
    private seconds: SecondManager;
    private currentFormat: Format = Format.H24;
    private timeZoneOffset: number;
    private amPmFormat: string;

    constructor(TimezoneOffset: number = 0) {
        this.timeZoneOffset = TimezoneOffset;
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
        const amPm = this.currentFormat === Format.AM_PM ? this.amPmFormat : '';
        return `${hours}:${minutes}:${seconds} ${amPm}`;
    }

    incrementHour(): void {
        const newHour = this.hours.incrementHour();
        this.hours = new HourManager(newHour);
    }

    getTimeWithOffset(): Date {
        const time = new Date();
        time.setHours(time.getUTCHours() + this.timeZoneOffset);
        return time;
    }

    incrementMinute(): void {
        const newMinute = this.minutes.incrementMinute();
        this.minutes = new MinuteManager(newMinute);
    }

    tick(incrementHours: boolean, incrementMinutes: boolean): void {
        const newSecond = this.seconds.incrementSecond();
        this.seconds = new SecondManager(newSecond);

        if (newSecond === 0) {
            const newMinute = this.minutes.incrementMinute();
            this.minutes = new MinuteManager(newMinute);

            if (incrementHours) {
                const newHour = this.hours.incrementHour();
                this.hours = new HourManager(newHour);
            } else if (incrementMinutes) {
                const newMinute = this.minutes.incrementMinute();
                this.minutes = new MinuteManager(newMinute);
            }

            if (newMinute === 0) {
                const newHour = this.hours.incrementHour();
                this.hours = new HourManager(newHour);
            }
        }
    }
    resetToCurrentTime(): void {
        const now = this.getTimeWithOffset();
        this.hours = new HourManager(now.getHours());
        this.minutes = new MinuteManager(now.getMinutes());
        this.seconds = new SecondManager(now.getSeconds());
    }

    private formatTime(value: number, format?: Format): string {
            if (format === Format.AM_PM) {
                this.amPmFormat = (value >= 12 )? 'PM' : 'AM';
                return value > 12 ? `${value - 12}` : value < 10 ? `0${value}` : `${value}`;
            } else if (format === Format.H24) {
                if (this.amPmFormat === 'PM') {
                    return value < 12 ? `${value + 12}` : `${value}`;
                }
            }
        return value < 10 ? `0${value}` : `${value}`;
    }
}
