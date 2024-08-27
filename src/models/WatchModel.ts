/**
 * This class manages the current time and provides methods to edit hours and minutes
 */

import { HourWrapper, MinuteWrapper, SecondWrapper } from '../example-unit';
enum Format {
    AM_PM = 'AM_PM',
    H24= 'H24',
}
export class WatchModel {
    private hours: HourWrapper;
    private minutes: MinuteWrapper;
    private seconds: SecondWrapper;
    private currentFormat: Format = Format.H24;
    private timeZoneOffset: number;
    private amPmFormat: string;

    constructor(TimezoneOffset: number = 0) {
        this.timeZoneOffset = TimezoneOffset;
        const now = this.getTimeWithOffset();
        this.hours = new HourWrapper(now.getHours());
        this.minutes = new MinuteWrapper(now.getMinutes());
        this.seconds = new SecondWrapper(now.getSeconds());
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
        this.hours = new HourWrapper(newHour);
        console.log('this.hours', this.hours);
    }

    getTimeWithOffset(): Date {
        const time = new Date();
        time.setHours(time.getUTCHours() + this.timeZoneOffset);
        return time;
    }

    incrementMinute(): void {
        const newMinute = this.minutes.incrementMinute();
        this.minutes = new MinuteWrapper(newMinute);
    }

    tick(incrementHours: boolean, incrementMinutes: boolean): void {
        const newSecond = this.seconds.incrementSecond();
        this.seconds = new SecondWrapper(newSecond);

        if (newSecond === 0) {
            const newMinute = this.minutes.incrementMinute();
            this.minutes = new MinuteWrapper(newMinute);

            if (incrementHours) {
                const newHour = this.hours.incrementHour();
                this.hours = new HourWrapper(newHour);
            } else if (incrementMinutes) {
                const newMinute = this.minutes.incrementMinute();
                this.minutes = new MinuteWrapper(newMinute);
            }

            if (newMinute === 0) {
                const newHour = this.hours.incrementHour();
                this.hours = new HourWrapper(newHour);
            }
        }
    }
    resetToCurrentTime(): void {
        const now = this.getTimeWithOffset();
        this.hours = new HourWrapper(now.getHours());
        this.minutes = new MinuteWrapper(now.getMinutes());
        this.seconds = new SecondWrapper(now.getSeconds());
    }

    private formatTime(value: number, format?: Format): string {
            if (format === Format.AM_PM) {
                this.amPmFormat = value >= 12 ? 'PM' : 'AM';
                return value > 12 ? `${value - 12}` : `${value}`;
            } else if (format === Format.H24) {
                if (this.amPmFormat === 'PM') {
                    return value < 12 ? `${value + 12}` : `${value}`;
                }
            }
        return value < 10 ? `0${value}` : `${value}`;
    }
}
