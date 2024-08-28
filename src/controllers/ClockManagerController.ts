import { add } from 'lodash';
import { DigitalClockController } from './DigitalClockController';
import { AnalogClockController } from './AnalogClockController';
import { ClockController } from './ClockController';


enum ClockType {
    ANALOG,
    DIGITAL,
}

export class ClockManagerController {
    public clocks: ClockController[] = [];

    constructor() {
        this.clocks = [];
    }

    addClock(timezoneOffset: number = 0, type: ClockType) {
        if (type === ClockType.ANALOG) this.addAnalogClock(timezoneOffset);
        else this.addDigitalClock(timezoneOffset);
    }

    addAnalogClock(timezoneOffset: number = 0) {
        const clock = new AnalogClockController(timezoneOffset);
        clock.startClock();
        this.clocks.push(clock);
        this.addEventToCloseButton(clock);
    }

    addDigitalClock(timezoneOffset: number = 0) {
        AnalogClockController;
        const clock = new DigitalClockController(timezoneOffset);
        clock.startClock();
        this.clocks.push(clock);
        this.addEventToCloseButton(clock);
    }

    addEventToCloseButton(clock: ClockController) {
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
