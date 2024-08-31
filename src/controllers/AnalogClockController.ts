import { AnalogClockView } from '../views/AnalogClockView';
import { ClockController } from './ClockController';
import { Matrix3x3, multiplyMatrices, rotationMatrix, scalingMatrix, translationMatrix } from '../utils/MatrixUtils';
import { Position, TimeType } from '../models/Type';



export class AnalogClockController extends ClockController {
    private static readonly ANGLE_CORRECTION = 90;
    private static readonly DEFAULT_SCALING = 0.8;
    private static readonly DEGREES_PER_SECOND = 6;
    private static readonly DEGREES_PER_MINUTE = 6;
    private static readonly DEGREES_PER_HOUR = 30;
    private static readonly ADDITIONAL_MINUTE_ANGLE = 0.1;

    private view: AnalogClockView;

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    deleteClock(): void {
        this.view.deleteClock();
    }

    /**
     * Rotates a handle by applying rotation, translation, and scaling transformations.
     */
    private rotateHandle(angle: number): Matrix3x3 {
        const rotationMat = rotationMatrix(angle + AnalogClockController.ANGLE_CORRECTION);
        const translationMat = translationMatrix(this.view.getCenter().x, this.view.getCenter().y);
        const scalingMat = scalingMatrix(AnalogClockController.DEFAULT_SCALING, AnalogClockController.DEFAULT_SCALING);
        const combinedMat = multiplyMatrices(translationMat, scalingMat);
        return multiplyMatrices(combinedMat, rotationMat);
    }

    render(): void {
        const secondsAngle = this.model.getSeconds() * AnalogClockController.DEGREES_PER_SECOND;
        const minutesAngle =
            this.model.getMinutes() * AnalogClockController.DEGREES_PER_MINUTE +
            this.model.getSeconds() * AnalogClockController.ADDITIONAL_MINUTE_ANGLE;
        const hoursAngle = (this.model.getHours() % 12) * AnalogClockController.DEGREES_PER_HOUR;

        const hourMatrix = this.rotateHandle(hoursAngle);
        const minuteMatrix = this.rotateHandle(minutesAngle);
        const secondMatrix = this.rotateHandle(secondsAngle);

        this.view.rotateNeedle(hourMatrix, TimeType.HOURS);
        this.view.rotateNeedle(minuteMatrix, TimeType.MINUTES);
        this.view.rotateNeedle(secondMatrix, TimeType.SECONDS);
    }

    protected initializeView(): void {
        this.view = new AnalogClockView(this.id);
    }

    startClock(): void {
        this.initializeView();
        this.makeDraggable();
        setInterval(() => {
            this.model.tick(false, false);
            this.render();
        }, 1000);
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.id));
    }

    makeDraggable(): void {
        const clockWrapper = this.view.getClockWrapper();
        clockWrapper.draggable = true;

        clockWrapper.addEventListener('dragstart', (event) => {
            clockWrapper.classList.add('dragging');
            event.dataTransfer!.setData('text/plain', clockWrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        clockWrapper.addEventListener('dragend', () => {
            clockWrapper.classList.remove('dragging');
        });

        clockWrapper.addEventListener('dragover', (event) => event.preventDefault());

        clockWrapper.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (draggedId && draggedId !== clockWrapper.id) {
                const draggedElement = document.getElementById(draggedId);
                const parent = clockWrapper.parentElement;

                if (draggedElement && parent) {
                    if (clockWrapper.compareDocumentPosition(draggedElement) & Node.DOCUMENT_POSITION_PRECEDING) {
                        parent.insertBefore(draggedElement, clockWrapper.nextSibling);
                    } else {
                        parent.insertBefore(draggedElement, clockWrapper);
                    }
                }
            }
        });
    }

    protected handleIncreaseButton(): void {
        throw new Error('Method not implemented.');
    }

    protected handleModeButton(): void {
        throw new Error('Method not implemented.');
    }
}
