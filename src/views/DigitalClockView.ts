/**
 *This class renders the time in hh:mm:ss format and handles the UI elements (blinking, color toggle)
*/
import { add } from 'lodash';
import { ClockView } from './ClockView';
import { TimeType } from '../views/ClockView';

enum Format {
    AM_PM,
    H24,
}

export class DigitalClockView extends ClockView {
    public id = 0;
    private watchDisplay: HTMLElement;
    private modeButton: HTMLElement;
    private lightButton: HTMLElement;
    private increaseButton: HTMLElement;
    private resetButton: HTMLElement;
    private formatButton: HTMLElement;
    private hourElement: HTMLElement;
    private minuteElement: HTMLElement;
    private secondElement: HTMLElement;
    private formatElement: HTMLElement;
    private closeButton: HTMLElement;
    private clockWrapper: HTMLElement;
    private static yellowColor: string = '#FBE106';
    private static whiteColor: string = '#FFFFFF';
    private backgroundColor: string = DigitalClockView.whiteColor;
    private static clockCounter: number = 0;

    constructor() {
        super();
        this.id = DigitalClockView.clockCounter++;
        this.clockWrapper = document.createElement('article');
        this.clockWrapper.id = `digital-clock-wrapper-${DigitalClockView.clockCounter}`;
        this.clockWrapper.className = 'clock-wrapper clock-article';

        this.closeButton = document.createElement('button');
        this.closeButton.id = `close-button-${DigitalClockView.clockCounter}`;
        this.closeButton.className = 'close-btn';
        this.closeButton.textContent = 'X';

        const watch = document.createElement('div');
        watch.id = `watch-${DigitalClockView.clockCounter}`;
        watch.className = 'watch';

        const resetControl = document.createElement('div');
        resetControl.id = `reset-control-${DigitalClockView.clockCounter}`;
        resetControl.className = 'reset-watch watch-control';
        this.resetButton = document.createElement('button');
        this.resetButton.id = `reset-button-${DigitalClockView.clockCounter}`;
        this.resetButton.className = 'reset-button';
        const resetLabel = document.createElement('span');
        resetLabel.id = `label-reset-${DigitalClockView.clockCounter}`;
        resetLabel.className = 'label-reset';
        resetLabel.textContent = 'Reset';

        const modeControl = document.createElement('div');
        modeControl.id = `mode-control-${DigitalClockView.clockCounter}`;
        modeControl.className = 'mode-watch watch-control';
        this.modeButton = document.createElement('button');
        this.modeButton.id = `mode-button-${DigitalClockView.clockCounter}`;
        this.modeButton.className = 'mode-button';
        const modeLabel = document.createElement('span');
        modeLabel.className = 'label-mode';
        modeLabel.textContent = 'Mode';

        const lightControl = document.createElement('div');
        lightControl.id = `light-control-${DigitalClockView.clockCounter}`;
        lightControl.className = 'light-watch watch-control';
        this.lightButton = document.createElement('button');
        this.lightButton.id = `light-button-${DigitalClockView.clockCounter}`;
        this.lightButton.className = 'light-button';
        const lightLabel = document.createElement('span');
        lightLabel.className = 'label-light';
        lightLabel.textContent = 'Light';

        const formatControl = document.createElement('div');
        formatControl.className = 'format-watch watch-control';
        formatControl.id = `format-control-${DigitalClockView.clockCounter}`;
        this.formatButton = document.createElement('button');
        this.formatButton.id = `format-button-${DigitalClockView.clockCounter}`;
        this.formatButton.className = 'format-button';
        const formatLabel = document.createElement('span');
        formatLabel.id = `label-format-${DigitalClockView.clockCounter}`;
        formatLabel.className = 'label-format';
        formatLabel.textContent = 'AM/PM-24H';

        const increaseControl = document.createElement('div');
        increaseControl.className = 'increase-watch watch-control';
        this.increaseButton = document.createElement('button');
        this.increaseButton.id = `increase-button-${DigitalClockView.clockCounter}`;
        this.increaseButton.className = 'increase-button';
        const increaseLabel = document.createElement('span');
        increaseLabel.className = 'label-increase';
        increaseLabel.textContent = 'Increase';

        const watchContainer = document.createElement('div');
        watchContainer.id = `watch-container-${DigitalClockView.clockCounter}`;
        watchContainer.className = 'watch-container';

        this.watchDisplay = document.createElement('div');
        this.watchDisplay.id = `watch-display-${DigitalClockView.clockCounter}`;
        this.watchDisplay.className = 'watch-display';

        // Assemble the structure
        resetControl.appendChild(this.resetButton);
        resetControl.appendChild(resetLabel);

        modeControl.appendChild(this.modeButton);
        modeControl.appendChild(modeLabel);

        lightControl.appendChild(this.lightButton);
        lightControl.appendChild(lightLabel);

        formatControl.appendChild(this.formatButton);
        formatControl.appendChild(formatLabel);

        increaseControl.appendChild(this.increaseButton);
        increaseControl.appendChild(increaseLabel);

        this.hourElement = document.createElement('div');
        this.hourElement.className = 'digit m';

        const separator = document.createElement('span');
        separator.textContent = ':';

        this.minuteElement = document.createElement('div');
        this.minuteElement.className = 'digit second s';

        this.secondElement = document.createElement('div');
        this.secondElement.className = 'digit digit--small ms';

        this.formatElement = document.createElement('div');
        this.formatElement.className = 'format';

        this.watchDisplay.appendChild(this.hourElement);
        this.watchDisplay.appendChild(separator);
        this.watchDisplay.appendChild(this.minuteElement);
        this.watchDisplay.appendChild(this.secondElement);
        this.watchDisplay.appendChild(this.formatElement);

        watchContainer.appendChild(this.watchDisplay);

        watch.appendChild(resetControl);
        watch.appendChild(modeControl);
        watch.appendChild(lightControl);
        watch.appendChild(formatControl);
        watch.appendChild(increaseControl);
        watch.appendChild(watchContainer);

        this.clockWrapper.appendChild(this.closeButton);
        this.clockWrapper.appendChild(watch);

        // Assuming you want to add this to an existing element in the document
        const clockContainer = document.getElementById('clocks-container');
        console.log('clockContainer', clockContainer);
        clockContainer.appendChild(this.clockWrapper);
    }

    drawHandle(lengthRatio: number, angle: number, type: TimeType): void {
        throw new Error('Method not implemented.');
    }

    clear(): void {
        throw new Error('Method not implemented.');
    }

    displayTime(time: string): void {
        const [hours, minutes, seconds, format] = time.split(':');
        this.hourElement.textContent = hours;
        this.minuteElement.textContent = minutes;
        this.secondElement.textContent = seconds;
        this.formatElement.textContent = format;
    }

    toggleBackgroundColor(): void {
        this.backgroundColor =
            this.backgroundColor === DigitalClockView.whiteColor ? DigitalClockView.yellowColor : DigitalClockView.whiteColor;
        this.watchDisplay.style.backgroundColor = this.backgroundColor;
    }

    blinkElement(timeType: TimeType): void {
        if (timeType === TimeType.HOURS) this.hourElement.classList.add('blinking');
        else this.minuteElement.classList.add('blinking');
    }

    stopBlinkElement(timeType: TimeType): void {
        if (timeType === TimeType.HOURS) this.hourElement.classList.remove('blinking');
        else this.minuteElement.classList.remove('blinking');
    }

    addEventToCloseButton(handleCloseButton: () => void): void {
        this.closeButton?.addEventListener('click', () => handleCloseButton());
    }

    deleteClock(): void {
        document.getElementById(`digital-clock-wrapper-${this.id + 1}`)?.remove();
    }

    // Method to initialize button event listeners
    init(
        handleModeButton: () => void,
        handleIncreaseButton: () => void,
        handleResetButton: () => void,
        handleFormatButton: () => void
    ): void {
        this.modeButton?.addEventListener('click', () => handleModeButton());
        this.lightButton?.addEventListener('click', () => this.toggleBackgroundColor());
        this.increaseButton?.addEventListener('click', () => handleIncreaseButton());
        this.resetButton?.addEventListener('click', () => handleResetButton());
        this.formatButton?.addEventListener('click', () => handleFormatButton());
        this.makeDraggable();
    }

    makeDraggable() {
        this.clockWrapper.draggable = true;

        this.clockWrapper.addEventListener('dragstart', (event) => {
            this.clockWrapper.classList.add('dragging'); // Add a class to style during drag
            event.dataTransfer!.setData('text/plain', this.clockWrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        this.clockWrapper.addEventListener('dragend', () => {
            this.clockWrapper.classList.remove('dragging'); // Remove class when drag ends
        });

        this.clockWrapper.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.clockWrapper.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (draggedId && draggedId !== this.clockWrapper.id) {
                const draggedElement = document.getElementById(draggedId);
                const parent = this.clockWrapper.parentElement;

                if (draggedElement && parent) {
                    // Determine if the dragged element should be placed before or after the current element
                    if (this.clockWrapper.compareDocumentPosition(draggedElement) & Node.DOCUMENT_POSITION_PRECEDING) {
                        // If the dragged element comes before the this.clockWrapper in the DOM, insert after
                        parent.insertBefore(draggedElement, this.clockWrapper.nextSibling);
                    } else {
                        // If the dragged element comes after the this.clockWrapper in the DOM, insert before
                        parent.insertBefore(draggedElement, this.clockWrapper);
                    }
                }
            }
        });
    }

    drawClockFace(): void {
        throw new Error('Method not implemented.');
    }
}
