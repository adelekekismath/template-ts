import { AnalogClockView } from '../views/AnalogClockView';
import { ClockController } from './ClockController';
import { applyTransformation, multiplyMatrices, rotationMatrix, scalingMatrix, translationMatrix } from '../utils/MatrixUtils';
import { Position, TimeType } from '../models/Type';


const ANGLE_CORRECTION = -90;
const DEFAULT_SCALING = 0.8;
const HOURS_RADIUS_SCALING = 0.6;
const MINUTES_RADIUS_SCALING = 0.8;
const DEGREES_PER_SECOND = 6; // 360° / 60s
const DEGREES_PER_MINUTE = 6; // 360° / 60m
const DEGREES_PER_HOUR = 30;  // 360° / 12h
const ADDITIONAL_MINUTE_ANGLE = 0.1; // Additional degrees per second for the minute hand
const ADDITIONAL_HOUR_ANGLE = 0.5; // Additional degrees per minute for the hour hand

export class AnalogClockController extends ClockController {
    private hourHandle: Position;
    private minuteHandle: Position;
    private secondHandle: Position;
    private view: AnalogClockView;

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    deleteClock(): void {
        this.view.deleteClock();
    }

    rotateHandle(handle: Position, angle: number): Position {
        const rotationMat = rotationMatrix(angle + ANGLE_CORRECTION);
        const translationMat = translationMatrix(this.view.getCenter().x, this.view.getCenter().y);
        const scalingMat = scalingMatrix(DEFAULT_SCALING, DEFAULT_SCALING);
        const translationAndScalMat = multiplyMatrices(translationMat, scalingMat);
        const finalTransformMatrix = multiplyMatrices(translationAndScalMat, rotationMat);
        return applyTransformation(handle, finalTransformMatrix);
    }

    render() {
        const secondsAngle = this.model.getSeconds() * DEGREES_PER_SECOND;
        const minutesAngle = this.model.getMinutes() * DEGREES_PER_MINUTE + this.model.getSeconds() * ADDITIONAL_MINUTE_ANGLE;
        const hoursAngle = (this.model.getHours() % 12) * DEGREES_PER_HOUR + this.model.getMinutes() * ADDITIONAL_HOUR_ANGLE;

        const hourPosition = this.rotateHandle(this.hourHandle, hoursAngle);
        const minutePosition = this.rotateHandle(this.minuteHandle, minutesAngle);
        const secondPosition = this.rotateHandle(this.secondHandle, secondsAngle);

        this.view.clear();
        this.view.drawClockFace();
        this.view.drawHandle(hourPosition, TimeType.HOURS);
        this.view.drawHandle(minutePosition, TimeType.MINUTES);
        this.view.drawHandle(secondPosition, TimeType.SECONDS);
    }

    protected initializeView(): void {
        this.view = new AnalogClockView(this.id);
        this.hourHandle = { x: this.view.getRadius() * HOURS_RADIUS_SCALING, y: 0 };
        this.minuteHandle = { x: this.view.getRadius() * MINUTES_RADIUS_SCALING, y: 0 };
        this.secondHandle = { x: this.view.getRadius(), y: 0 };
    }

    startClock() {
        this.initializeView();
        this.makeDraggable();
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.render();
        }, 1000);
    }


    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.id));
    }

    protected handleIncreaseButton(): void {
        throw new Error('Method not implemented.');
    }

    protected handleModeButton(): void {
        throw new Error('Method not implemented.');
    }

    makeDraggable() {
        this.view.getClockWrapper().draggable = true;

        this.view.getClockWrapper().addEventListener('dragstart', (event) => {
            this.view.getClockWrapper().classList.add('dragging');
            event.dataTransfer!.setData('text/plain', this.view.getClockWrapper().id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        this.view.getClockWrapper().addEventListener('dragend', () => {
            this.view.getClockWrapper().classList.remove('dragging');
        });

        this.view.getClockWrapper().addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.view.getClockWrapper().addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (draggedId && draggedId !== this.view.getClockWrapper().id) {
                const draggedElement = document.getElementById(draggedId);
                const parent = this.view.getClockWrapper().parentElement;

                if (draggedElement && parent) {
                    if (this.view.getClockWrapper().compareDocumentPosition(draggedElement) & Node.DOCUMENT_POSITION_PRECEDING) {
                        parent.insertBefore(draggedElement, this.view.getClockWrapper().nextSibling);
                    } else {
                        parent.insertBefore(draggedElement, this.view.getClockWrapper());
                    }
                }
            }
        });
    }
}
