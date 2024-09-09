/**
 * Generic class to manage time units (hours, minutes, seconds).
 */
class TimeModel {
    constructor(private readonly value: number, private readonly max: number) {}

    /**
     * Returns the current value.
     */
    get(): number {
        return this.value;
    }

    /**
     * Increments the time value by one unit, cycling through a period defined by max.
     */
    increment(): number {
        return (this.value + 1) % this.max;
    }
}

/**
 * Manager for hours, using TimeModel with a 24-hour cycle.
 */
export class HourModel extends TimeModel {
    constructor(hours: number) {
        super(hours, 24);
    }
}

/**
 * Manager for minutes, using TimeModel with a 60-minute cycle.
 */
export class MinuteModel extends TimeModel {
    constructor(minutes: number) {
        super(minutes, 60);
    }
}

/**
 * Manager for seconds, using TimeModel with a 60-second cycle.
 */
export class SecondModel extends TimeModel {
    constructor(seconds: number) {
        super(seconds, 60);
    }
}
