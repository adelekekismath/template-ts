/**
 * Generic class to manage time units (hours, minutes, seconds).
 */
export class TimeModel {
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

