import { DigitalClockController } from './DigitalClockController';
import { AnalogClockController } from './AnalogClockController';
import { ClockController } from './ClockController';
import { ClockType } from '../models/Type';

export class ClockManagerController {
    private clocks: ClockController[] = [];

    addClock(timezoneOffset: number = 0, type: ClockType): void {
        const clock = this.createClock(type, timezoneOffset);
        clock.initializeView();
        clock.startClock();
        this.clocks.push(clock);
        this.addEventToCloseButton(clock);
    }

    private createClock(type: ClockType, timezoneOffset: number): ClockController {
        return type === ClockType.ANALOG ? new AnalogClockController(timezoneOffset) : new DigitalClockController(timezoneOffset);
    }

    private addEventToCloseButton(clock: ClockController): void {
        clock.addEventToCloseButton((clockNumber: number) => this.removeClock(clockNumber));
    }

    private removeClock(clockNumber: number): void {
        const index = this.clocks.findIndex((clock) => clock.getId() === clockNumber);
        if (index !== -1) {
            const [clockToRemove] = this.clocks.splice(index, 1); 
            clockToRemove.deleteClock(); 
        }
    }
}
