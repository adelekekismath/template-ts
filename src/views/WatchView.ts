/**
 *This class renders the time in hh:mm:ss format and handles the UI elements (blinking, color toggle)
*/
import { add } from 'lodash';
import { WatchController } from '../controllers/WatchController';

enum TimeType {
    HOURS,
    MINUTES,
}

export class WatchView {
    private watchElement: HTMLElement;
    private modeButton: HTMLElement;
    private lightButton: HTMLElement;
    private increaseButton: HTMLElement;
    private hourElement: HTMLElement;
    private minuteElement: HTMLElement;
    private secondElement: HTMLElement;
    private static yellowColor: string = '#FBE106';
    private static whiteColor: string = '#FFFFFF';
    private backgroundColor: string = WatchView.whiteColor;

    constructor(watchElement: HTMLElement, modeButton: HTMLElement, lightButton: HTMLElement, increaseButton: HTMLElement) {
        this.watchElement = watchElement;
        this.modeButton = modeButton;
        this.lightButton = lightButton;
        this.lightButton = lightButton;
        this.increaseButton = increaseButton;

        this.watchElement.innerHTML = '';

        this.hourElement = document.createElement('div');
        this.hourElement.className = 'digit m';

        const separator = document.createElement('span');
        separator.textContent = ':';

        this.minuteElement = document.createElement('div');
        this.minuteElement.className = 'digit second s';

        this.secondElement = document.createElement('div');
        this.secondElement.className = 'digit digit--small ms';

        this.watchElement.appendChild(this.hourElement);
        this.watchElement.appendChild(separator);
        this.watchElement.appendChild(this.minuteElement);
        this.watchElement.appendChild(this.secondElement);
    }

    displayTime(time: string) {
        const [hours, minutes, seconds] = time.split(':');
        this.hourElement.textContent = hours;
        this.minuteElement.textContent = minutes;
        this.secondElement.textContent = seconds;
    }

    toggleBackgroundColor() {
        this.backgroundColor = this.backgroundColor === WatchView.whiteColor ? WatchView.yellowColor : WatchView.whiteColor;
        this.watchElement.style.backgroundColor = this.backgroundColor;
    }

    blinkElement(timeType: TimeType) {
        if (timeType === TimeType.HOURS) 
            this.hourElement.classList.add('blinking');
        else 
            this.minuteElement.classList.add('blinking');
    }

    stopBlinkElement(timeType: TimeType) {
        if (timeType === TimeType.HOURS) 
            this.hourElement.classList.remove('blinking');
        else 
            this.minuteElement.classList.remove('blinking');
    }

    // Method to initialize button event listeners
    init(handleModeButton: () => void, handleIncreaseButton: () => void): void {
        this.modeButton?.addEventListener('click', () => handleModeButton());
        this.lightButton?.addEventListener('click', () => this.toggleBackgroundColor());
        this.increaseButton?.addEventListener('click', () => handleIncreaseButton());
    }
}
