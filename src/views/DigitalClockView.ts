import { TimeType } from '../models/Type';

export class DigitalClockView {
    private static readonly YELLOW_COLOR: string = '#FBE106';
    private static readonly WHITE_COLOR: string = '#FFFFFF';
    private static readonly CLOCK_WRAPPER_CLASS: string = 'clock-wrapper clock-article';
    private static readonly BUTTON_CLASSES = {
        close: 'close-btn',
        reset: 'reset-button',
        mode: 'mode-button',
        light: 'light-button',
        format: 'format-button',
        increase: 'increase-button',
    };
    private static readonly LABELS = {
        reset: 'Reset',
        mode: 'Mode',
        light: 'Light',
        format: 'AM/PM-24H',
        increase: 'Increase',
    };

    private backgroundColor: string = DigitalClockView.WHITE_COLOR;
    private clockWrapper: HTMLElement;
    private watchDisplay: HTMLElement;
    private closeButton: HTMLElement;
    private resetButton: HTMLElement;
    private modeButton: HTMLElement;
    private lightButton: HTMLElement;
    private formatButton: HTMLElement;
    private increaseButton: HTMLElement;
    private hourElement: HTMLElement;
    private minuteElement: HTMLElement;
    private secondElement: HTMLElement;
    private formatElement: HTMLElement;

    constructor(private id: number) {
        this.clockWrapper = this.createElement('article', DigitalClockView.CLOCK_WRAPPER_CLASS, `digital-clock-wrapper-${this.id}`);
        this.closeButton = this.createButton('button', DigitalClockView.BUTTON_CLASSES.close, `close-button-${this.id}`, 'X');

        const watch = this.createElement('div', 'watch', `watch-${this.id}`);
        const watchContainer = this.createElement('div', 'watch-container', `watch-container-${this.id}`);
        this.watchDisplay = this.createElement('div', 'watch-display', `watch-display-${this.id}`);

        this.resetButton = this.createControlButton('reset', 'reset-watch', DigitalClockView.LABELS.reset);
        this.modeButton = this.createControlButton('mode', 'mode-watch', DigitalClockView.LABELS.mode);
        this.lightButton = this.createControlButton('light', 'light-watch', DigitalClockView.LABELS.light);
        this.formatButton = this.createControlButton('format', 'format-watch', DigitalClockView.LABELS.format);
        this.increaseButton = this.createControlButton('increase', 'increase-watch', DigitalClockView.LABELS.increase);

        this.hourElement = this.createElement('div', 'digit m');
        const separator = this.createElement('span', 'digit');
        separator.textContent = ':';
        this.minuteElement = this.createElement('div', 'digit second s');
        this.secondElement = this.createElement('div', 'digit digit--small ms');
        this.formatElement = this.createElement('div', 'format');

        this.assembleClock(watch, watchContainer, separator);
        this.attachToDOM('clocks-container');
    }

    private createElement(tag: string, className?: string, id?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }

    private createButton(tag: string, className: string, id: string, text: string): HTMLElement {
        const button = this.createElement(tag, className, id);
        button.textContent = text;
        return button;
    }

    private createControlButton(
        control: keyof typeof DigitalClockView.BUTTON_CLASSES,
        controlClass: string,
        labelText: string
    ): HTMLElement {
        const controlDiv = this.createElement('div', `${controlClass} watch-control`, `${controlClass}-control-${this.id}`);
        const button = this.createButton('button', DigitalClockView.BUTTON_CLASSES[control], `${controlClass}-button-${this.id}`, '');
        const label = this.createElement('span', `label-${control}`);
        label.textContent = labelText;

        controlDiv.appendChild(button);
        controlDiv.appendChild(label);
        return controlDiv;
    }

    private assembleClock(watch: HTMLElement, watchContainer: HTMLElement, separator: HTMLElement): void {
        this.watchDisplay.appendChild(this.hourElement);
        this.watchDisplay.appendChild(separator);
        this.watchDisplay.appendChild(this.minuteElement);
        this.watchDisplay.appendChild(this.secondElement);
        this.watchDisplay.appendChild(this.formatElement);

        watchContainer.appendChild(this.watchDisplay);

        watch.appendChild(this.resetButton);
        watch.appendChild(this.modeButton);
        watch.appendChild(this.lightButton);
        watch.appendChild(this.formatButton);
        watch.appendChild(this.increaseButton);
        watch.appendChild(watchContainer);

        this.clockWrapper.appendChild(this.closeButton);
        this.clockWrapper.appendChild(watch);
    }

    private attachToDOM(containerId: string): void {
        const clockContainer = document.getElementById(containerId);
        clockContainer?.appendChild(this.clockWrapper);
    }

    getCloseButton(): HTMLElement {
        return this.closeButton;
    }

    getLightButton(): HTMLElement {
        return this.lightButton;
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
            this.backgroundColor === DigitalClockView.WHITE_COLOR ? DigitalClockView.YELLOW_COLOR : DigitalClockView.WHITE_COLOR;
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
        this.closeButton.addEventListener('click', handleCloseButton);
    }

    deleteClock(): void {
        this.clockWrapper.remove();
    }

    getResetButton(): HTMLElement {
        return this.resetButton;
    }

    getFormatButton(): HTMLElement {
        return this.formatButton;
    }

    getIncreaseButton(): HTMLElement {
        return this.increaseButton;
    }

    getModeButton(): HTMLElement {
        return this.modeButton;
    }

    getClockWrapper(): HTMLElement {
        return this.clockWrapper;
    }
}
