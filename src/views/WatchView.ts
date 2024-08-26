/**
 *This class renders the time in hh:mm:ss format and handles the UI elements (blinking, color toggle)
*/
import { WatchController } from '../controllers/WatchController';

export class WatchView {
    private watchElement: HTMLElement;
    private modeButton: HTMLElement;
    private lightButton: HTMLElement;
    private increaseButton: HTMLElement;
    private backgroundColor: string = '#FFFFFF';
    private controller: WatchController;

    constructor(
        controller: WatchController,
        watchElement: HTMLElement,
        modeButton: HTMLElement,
        lightButton: HTMLElement,
        increaseButton: HTMLElement
    ) {
        this.watchElement = watchElement;
        this.modeButton = modeButton;
        this.lightButton = lightButton;
        this.lightButton = lightButton;
        this.increaseButton = increaseButton;
        this.controller = controller;
        this.init();
    }

    displayTime(time: string) {
        const [hours, minutes, seconds] = time.split(':');
        this.watchElement.innerHTML = `
        <div class="digit m">${hours}</div>
        <span>:</span>
        <div class="digit second s">${minutes}</div>
        <div class="digit digit--small ms">${seconds}</div>`;
    }

    toggleBackgroundColor() {
        this.backgroundColor = this.backgroundColor === '#FFFFFF' ? '#FBE106' : '#FFFFFF';
        this.watchElement.style.backgroundColor = this.backgroundColor;
    }

    // Method to initialize button event listeners
    init() {
        this.modeButton.addEventListener('click', () => this.controller.handleModeButton());
        this.lightButton.addEventListener('click', () => this.controller.handleLightButton());
        this.lightButton.addEventListener('click', () => this.controller.handlelightButton());
    }

    startClock() {
        setInterval(() => {
            this.displayTime(this.controller.displayCurrentTime());
        }, 1000);
    }
}
