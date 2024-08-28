import { ClockModel } from '../models/ClockModel';
import { AnalogClockView } from '../views/AnalogClockView';
import { ClockController } from './ClockController';
import { applyTransformation, Matrix3x3 } from '../utils/MatrixUtils';
import { TimeType } from '../views/ClockView';


export class AnalogClockController extends ClockController {
    private hourHandle: [number, number];
    private minuteHandle: [number, number];
    private secondHandle: [number, number];

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    protected handleIncreaseButton(): void {
        throw new Error('Method not implemented.');
    }

    protected handleModeButton(): void {
        throw new Error('Method not implemented.');
    }

    deleteClock(): void {
        this.view.deleteClock();
    }

    rotateHandle(handle: [number, number], angle: number): [number, number] {
        const rad = (Math.PI / 180) * angle;
        const rotationMatrix: Matrix3x3 = [
            [Math.cos(rad), -Math.sin(rad), 0],
            [Math.sin(rad), Math.cos(rad), 0],
            [0, 0, 1],
        ];
        return applyTransformation(handle, rotationMatrix);
    }

    render() {
        const secondsAngle = this.model.getSeconds() * 6;
        const minutesAngle = this.model.getMinutes() * 6 + this.model.getSeconds() * 0.1;
        const hoursAngle = (this.model.getHours() % 12) * 30 + this.model.getMinutes() * 0.5;

        this.view.clear();
        this.view.drawClockFace();
        this.view.drawHandle(0.5, hoursAngle, TimeType.HOURS);
        this.view.drawHandle(0.7, minutesAngle, TimeType.MINUTES);
        this.view.drawHandle(0.7,secondsAngle, TimeType.SECONDS);
    }

    protected initializeView(): void {
        this.view = new AnalogClockView();
        this.hourHandle = [0, -this.view.getRadius() * 0.5];
        this.minuteHandle = [0, -this.view.getRadius() * 0.7];
        this.secondHandle = [0, -this.view.getRadius() * 0.9];
    }

    startClock() {
        this.initializeView();
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.render();
        }, 1000);
    }
}
