    /**
     * This class has a very nice and complex method allowing to manipulate a given number.
     */
    export class HourWrapper {
        constructor(private readonly hours: number) {}

        /**
         * Returns a number for very important reasons, obviously.
         */
        get(): number {
            return this.hours;
        }

        /* 
        *Increments the time value by one unit, cycling through a 24-hour period.
         */
        incrementHour(): number {
            return (this.hours + 1) % 24;
        }
    }

    export class MinuteWrapper {
        constructor(private readonly minutes: number) {}

        /**
         * Returns a number for very important reasons, obviously.
         */
        get(): number {
            return this.minutes;
        }

        /* 
        *Increments the time value by one unit, cycling through a 60-minute period.
         */
        incrementMinute(): number {
            return (this.minutes + 1) % 60;
        }
    }

    export class SecondWrapper {
        constructor(private readonly seconds: number) {}

        /**
         * Returns a number for very important reasons, obviously.
         */
        get(): number {
            return this.seconds;
        }

        /* 
        *Increments the time value by one unit, cycling through a 60-second period.
         */
        incrementSecond(): number {
            return (this.seconds + 1) % 60;
        }
    }
