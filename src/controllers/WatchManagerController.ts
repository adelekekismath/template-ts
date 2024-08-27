import { WatchController } from "./WatchController";

export class WatchManagerController {
    public clocks: WatchController[] = [];

    constructor() {
        this.clocks = [];
    }

    addClock(timezoneOffset: number = 0) {
        const clock = new WatchController(timezoneOffset);
        clock.startClock();
        this.clocks.push(clock);
        this.addEventToCloseButton(clock);
    }

    addEventToCloseButton(clock: WatchController) {
        clock.addEventToCloseButton((clockNumber: number) => this.removeClock(clockNumber));
    }

    removeClock(clockNumber: number) {
        const clockToRemove = this.clocks.find((clock) => clock.id === clockNumber);
        console.log('clockNumber', clockNumber);
        console.log('this.clocks', this.clocks);
        console.log('clockId', clockToRemove?.id);
        console.log('clockToRemove', clockToRemove);
        if (!clockToRemove) {
            return;
        }
        
        console.log('this.clocks', this.clocks);
        console.log('this.clocks.indexOf(clockToRemove)', this.clocks.indexOf(clockToRemove));
        this.clocks = this.clocks.slice(this.clocks.indexOf(clockToRemove), 1);
        document.getElementById(`clock-wrapper-${clockNumber+1}`)?.remove();
    }

    makeDraggable(clockElement: HTMLElement) {
        // Implementation of draggable functionality, possibly using a library like interact.js
    }
}
