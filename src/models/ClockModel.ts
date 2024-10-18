import { parseInt } from "lodash";
import { Matrix3x3 } from "../utils/MatrixUtils";
import { TimeModel } from "./TimeUnitsModel";
import { ClockType, Observer, TimeType } from "./Type";

export class Observable {
    private observers: Observer[] = [];

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(data: any): void {
        this.observers.forEach(observer => observer.update(data));
    }
}

export class ClockModel extends Observable {
    private static readonly MAX_HOURS = 24;
    private static readonly MAX_MINUTES_SECONDS = 60;

    private timeUnits: Record<TimeType, TimeModel>;
    private timeZoneOffset: number;
    private clockType: ClockType;

    constructor(timeZoneOffset: number = 0, clockType: ClockType = ClockType.DIGITAL) {
        super();
        this.timeZoneOffset = timeZoneOffset;
        this.clockType = clockType;
        const now = this.getTimezoneOffset();

        this.timeUnits = {
            [TimeType.HOURS]: new TimeModel(now.getHours(), ClockModel.MAX_HOURS),
            [TimeType.MINUTES]: new TimeModel(now.getMinutes(), ClockModel.MAX_MINUTES_SECONDS),
            [TimeType.SECONDS]: new TimeModel(now.getSeconds(), ClockModel.MAX_MINUTES_SECONDS),
        };
    }

    getTimeUnit(type: TimeType): number {
        return this.timeUnits[type].get();
    }

    setTimeUnit(type: TimeType, value: number): void {
        this.timeUnits[type] = new TimeModel(value, this.getMaxValueForType(type));
        this.notifyIfDigital({ value: this.timeUnits[type].get(), type });
    }

    incrementTimeUnit(type: TimeType): void {
        const maxVal = this.getMaxValueForType(type);
        const currentModel = this.timeUnits[type];

        this.timeUnits[type] = new TimeModel(currentModel.increment(), maxVal);

        if (type === TimeType.SECONDS && this.timeUnits[TimeType.SECONDS].get() === 0) {
            this.incrementTimeUnit(TimeType.MINUTES);
        } else if (type === TimeType.MINUTES && this.timeUnits[TimeType.MINUTES].get() === 0) {
            this.incrementTimeUnit(TimeType.HOURS);
        }

        this.notifyIfDigital({ value: this.timeUnits[type].get(), type });
    }

    private notifyIfDigital(data: { value: number, type: TimeType }): void {
        if (this.clockType === ClockType.DIGITAL) {
            this.notifyObservers(data);
        }
    }

    private getTimezoneOffset(): Date {
        const GMT_Hours = Math.floor(this.timeZoneOffset);
        const GMT_Minutes = Math.fround(this.timeZoneOffset - GMT_Hours) * 60;
        console.log("GMT_Hours: ", GMT_Hours);
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        if( GMT_Minutes <= 0) {
            return new Date(utc + (3600000 * GMT_Hours));
        }
        return new Date(utc + (3600000 * GMT_Hours) + (60000 * GMT_Minutes));
    }

    private getMaxValueForType(type: TimeType): number {
        if (type === TimeType.HOURS) {
            return ClockModel.MAX_HOURS;
        }
        return ClockModel.MAX_MINUTES_SECONDS;
    }

    setHourMatrix(matrix: Matrix3x3): void {
        throw new Error('Method not implemented.');
    }
    setMinuteMatrix(matrix: Matrix3x3): void {
        throw new Error('Method not implemented.');
    }

    setSecondMatrix(matrix: Matrix3x3): void {
        throw new Error('Method not implemented.');
    }


}

export class AnalogClockModel extends ClockModel {
    private matrices: Record<TimeType, Matrix3x3> = {
        [TimeType.HOURS]: null,
        [TimeType.MINUTES]: null,
        [TimeType.SECONDS]: null,
    };

    constructor(timeZoneOffset: number = 0) {
        super(timeZoneOffset, ClockType.ANALOG);
    }

    setMatrix(type: TimeType, matrix: Matrix3x3): void {
        this.matrices[type] = matrix;
        this.notifyObservers({ transformedMat: matrix, type });
    }

    setHourMatrix(matrix: Matrix3x3): void {
        this.setMatrix(TimeType.HOURS, matrix);
    }

    setMinuteMatrix(matrix: Matrix3x3): void {
        this.setMatrix(TimeType.MINUTES, matrix);
    }

    setSecondMatrix(matrix: Matrix3x3): void {
        this.setMatrix(TimeType.SECONDS, matrix);
    }
}
