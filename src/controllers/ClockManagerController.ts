import { DigitalClockController } from './DigitalClockController';
import { AnalogClockController } from './AnalogClockController';
import { ClockController } from './ClockController';
import { ClockType } from '../models/Type';


export class ClockManagerController {
    private clocks: ClockController[] = [];

    addClock(timezoneOffset: number = 0, type: ClockType): void {
        const clock = type === ClockType.ANALOG
            ? new AnalogClockController(timezoneOffset)
            : new DigitalClockController(timezoneOffset);

        clock.startClock();
        this.clocks.push(clock);
        this.addEventToCloseButton(clock);
    }

    private addEventToCloseButton(clock: ClockController): void {
        clock.addEventToCloseButton((clockNumber: number) => this.removeClock(clockNumber));
    }

    private removeClock(clockNumber: number): void {
        const clockToRemove = this.clocks.find((clock) => clock.getId() === clockNumber);
        if (clockToRemove) {
            this.clocks = this.clocks.filter((clock) => clock.getId() !== clockNumber);
            clockToRemove.deleteClock();
        }
    }
}
