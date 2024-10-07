import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';
import { TimeType, Format } from '../models/Type';

export class DigitalClockController extends ClockController {
    private isHoursEditable = false;
    private isMinutesEditable = false;
    private mode = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes
    private view!: DigitalClockView;

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    initializeView(): void {
        this.view = new DigitalClockView(this.getId());
    }

    private updateTimeDisplay(): void {
        this.view.displayTime(this.currentTime());
    }

    private blink(timeType: TimeType): void {
        this.view.blinkElement(timeType);
        this.isHoursEditable = timeType === TimeType.HOURS;
        this.isMinutesEditable = timeType === TimeType.MINUTES;
    }

    private stopBlinking(): void {
        this.view.stopBlinkElement(TimeType.HOURS);
        this.view.stopBlinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = false;
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementHours();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinutes();
        }
        this.updateTimeDisplay();
    }

    handleModeButton(): void {
        this.mode = (this.mode + 1) % 3;
        switch (this.mode) {
            case 1:
                this.blink(TimeType.HOURS);
                break;
            case 2:
                this.stopBlinking();
                this.blink(TimeType.MINUTES);
                break;
            default:
                this.stopBlinking();
        }
    }

    handleResetButton(): void {
        this.resetClock();
        this.updateTimeDisplay();
    }

    handleFormatButton(): void {
        this.view.toggleFormat();
        this.updateTimeDisplay();
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.getId()));
    }

    protected initializeButonsEvents(): void {
        this.addEventListener(this.view.getLightButton(), 'click', () => this.view.toggleBackgroundColor());
        this.addEventListener(this.view.getIncreaseButton(), 'click', () => this.handleIncreaseButton());
        this.addEventListener(this.view.getModeButton(), 'click', () => this.handleModeButton());
        this.addEventListener(this.view.getResetButton(), 'click', () => this.handleResetButton());
        this.addEventListener(this.view.getFormatButton(), 'click', () => this.handleFormatButton());
        this.makeDraggable();
    }

    startClock(): void {
        this.initializeButonsEvents();
        setInterval(() => {
            this.tick();
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.updateTimeDisplay();
        }, 1000);
    }

    deleteClock(): void {
        this.view.deleteClock();
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
}
