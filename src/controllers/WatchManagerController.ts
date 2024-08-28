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
        if (!clockToRemove) {
            return;
        }
        this.clocks = this.clocks.filter((clock) => clock.id !== clockNumber);
        clockToRemove.deleteClock();
    }
}
