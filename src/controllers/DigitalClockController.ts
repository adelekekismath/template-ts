import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';
import { TimeType, Format } from '../models/Type';

export class DigitalClockController extends ClockController {
    private isHoursEditable = false;
    private isMinutesEditable = false;
    private mode = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes
    private view!: DigitalClockView; // Initialized in `initializeView`

    constructor(timezoneOffset: number) {
        super(timezoneOffset);
    }

    protected initializeView(): void {
        this.view = new DigitalClockView(this.id);
    }

    private updateTimeDisplay(): void {
        this.view.displayTime(this.model.getCurrentTime(this.format));
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
            this.model.incrementHour();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinute();
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
        this.model.resetToCurrentTime();
        this.updateTimeDisplay();
    }

    handleFormatButton(): void {
        this.format = this.format === Format.H24 ? Format.AM_PM : Format.H24;
        this.updateTimeDisplay();
    }

    addEventToCloseButton(removeClock: (clockNumber: number) => void): void {
        this.addEventListener(this.view.getCloseButton(), 'click', () => removeClock(this.id));
    }

    protected initializeButonsEvents(): void {
        this.addEventListener(this.view.getLightButton(), 'click', () => this.view.toggleBackgroundColor());
        this.addEventListener(this.view.getIncreaseButton(), 'click', () => this.handleIncreaseButton());
        this.addEventListener(this.view.getModeButton(), 'click', () => this.handleModeButton());
        this.addEventListener(this.view.getResetButton(), 'click', () => this.handleResetButton());
        this.addEventListener(this.view.getFormatButton(), 'click', () => this.handleFormatButton());
    }

    startClock(): void {
        this.initializeView();
        this.initializeButonsEvents();
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.updateTimeDisplay();
        }, 1000);
    }

    deleteClock(): void {
        this.view.deleteClock();
    }

    makeDraggable(): void {
        const wrapper = this.view.getClockWrapper();
        wrapper.draggable = true;

        wrapper.addEventListener('dragstart', (event) => {
            wrapper.classList.add('dragging');
            event.dataTransfer!.setData('text/plain', wrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        wrapper.addEventListener('dragend', () => {
            wrapper.classList.remove('dragging');
        });

        wrapper.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        wrapper.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (draggedId && draggedId !== wrapper.id) {
                const draggedElement = document.getElementById(draggedId);
                const parent = wrapper.parentElement;

                if (draggedElement && parent) {
                    if (wrapper.compareDocumentPosition(draggedElement) & Node.DOCUMENT_POSITION_PRECEDING) {
                        parent.insertBefore(draggedElement, wrapper.nextSibling);
                    } else {
                        parent.insertBefore(draggedElement, wrapper);
                    }
                }
            }
        });
    }
}
