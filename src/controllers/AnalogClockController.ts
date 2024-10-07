import { AnalogClockView } from '../views/AnalogClockView';
import { ClockController } from './ClockController';
import { Matrix3x3, multiplyMatrices, rotationMatrix, scalingMatrix, translationMatrix } from '../utils/MatrixUtils';
import { TimeType } from '../models/Type';



export class AnalogClockController extends ClockController {
    private static readonly ANGLE_CORRECTION = 90;
    private static readonly DEFAULT_SCALING = 0.8;
    private static readonly DEGREES_PER_SECOND = 6;
    private static readonly DEGREES_PER_MINUTE = 6;
    private static readonly DEGREES_PER_HOUR = 30;
    private static readonly ADDITIONAL_MINUTE_ANGLE = 0.1;

    private intervalId: NodeJS.Timeout | null = null;

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

    initializeView(): void {
        this.view = new AnalogClockView(this.getId());
        this.addEventListener(this.view.getEditButton(), 'click', () => this.toggleEditMode());
    }

    startClock(): void {
        this.makeDraggable();
        this.intervalId = setInterval(() => {
            this.tick();
            this.render();
        }, 1000);
    }

    // Method to toggle edit mode on/off
    private toggleEditMode(): void {
        this.view.toggleEditMode();

        if (this.view.isEditModeActive()) {
            this.view.activeEditMode();
            this.stopClock(); // Stop the clock during edit mode
        } else {
            if (this.view.hasClockBeenEdited()) {
                const transform = this.view.getMinuteNeedleTransformMatrix();
                const angle = this.extractRotationAngleFromTransform(transform);

                if (angle !== null) {
                    this.updateTimeAfterEdit(angle); // Update time based on the new angle
                }
                this.view.deactivateEditMode();
                this.startClock(); // Restart the clock after editing
            } else {
                this.view.deactivateEditMode();
                this.startClock(); // Restart the clock after editing
            }
        }
    }

    // Helper function to extract rotation angle from the transform matrix
    private extractRotationAngleFromTransform(transform: string): number | null {
        const matrixMatch = transform.match(/^matrix\((.+)\)$/);
        if (!matrixMatch) return null;

        const [a, b] = matrixMatch[1].split(', ').map(parseFloat);
        let angle = Math.atan2(b, a) * (180 / Math.PI); // Convert matrix values to an angle
        return (angle + 360) % 360; // Normalize angle to [0, 360] range
    }

    // Method to stop the clock
    private stopClock(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.makeUndraggable();
            this.view.enableMinuteHandleDragging();
        }
    }

    private calculateMinutesFromAngle(angle: number): number {
        return Math.round(angle / 6);
    }

    // Method to update the time after editing the clock
    private updateTimeAfterEdit(adjustedAngle: number): void {
        const newMinutes = this.calculateMinutesFromAngle(adjustedAngle); // Calculate the new minutes based on the angle
        const currentHours = this.model.getHours();

        const hoursToAdjust = this.view.getMinuteNeedleRotationCount(); // Get the number of hours to adjust

        this.setMinutes(newMinutes);

        // Adjust the hours if necessary
        if (hoursToAdjust !== 0) {
            console.log(`Adjusting hours by ${hoursToAdjust}`);
            this.model.setHours(currentHours + hoursToAdjust);
        }
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.getId()));
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
            if (!draggedId || draggedId === clockWrapper.id) return;

            const draggedElement = document.getElementById(draggedId);
            const parent = clockWrapper.parentElement;

            if (draggedElement && parent) {
                const allClocks = Array.from(parent.children);

                // Find the index of the dropped element and the dragged element
                const droppedIndex = allClocks.indexOf(clockWrapper);
                const draggedIndex = allClocks.indexOf(draggedElement);

                if (droppedIndex > -1 && draggedIndex > -1) {
                    const droppedElement = parent.children[droppedIndex];

                    // Swap the dragged and dropped elements
                    if (droppedIndex < draggedIndex) {
                        const nextSibling = draggedElement.nextSibling;
                        parent.insertBefore(draggedElement, droppedElement);
                        parent.insertBefore(droppedElement, nextSibling);
                    } else {
                        const nextSibling = draggedElement.nextSibling;
                        parent.insertBefore(draggedElement, droppedElement.nextSibling);
                        parent.insertBefore(droppedElement, nextSibling);
                    }
                }
            }
        });
    }
    makeUndraggable(): void {
        const clockWrapper = this.view.getClockWrapper();
        clockWrapper.draggable = false;
    }

    protected handleIncreaseButton(): void {
        throw new Error('Method not implemented.');
    }

    protected handleModeButton(): void {
        throw new Error('Method not implemented.');
    }
}
