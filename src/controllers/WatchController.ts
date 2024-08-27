/**
 * This class processes button inputs and updates the model and triggers the view to re-render.
 */

import { WatchModel } from '../models/WatchModel';
import { WatchView } from '../views/WatchView';
enum TimeType {
    HOURS,
    MINUTES,
}

export class WatchController {
    private model: WatchModel;
    private view: WatchView;
    private isHoursEditable: boolean = false;
    private isMinutesEditable: boolean = false;
    private incrementHours: boolean = false;
    private incrementMinutes: boolean = false;
    private mode: number = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes

    constructor(model: WatchModel, view: WatchView) {
        this.model = model;
        this.view = view;
    }

    handleIncreaseButton(): void {
        if (this.isHoursEditable) {
            this.model.incrementHour();
        } else if (this.isMinutesEditable) {
            this.model.incrementMinute();
        }
    }

    displayCurrentTime() {
        return this.model.getCurrentTime();
    }

    handleModeButton() {
        this.mode = (this.mode + 1) % 3;

        switch (this.mode) {
            case 0:
                // Arrêter le clignotement, rien n'est éditable
                this.stopBlinking();
                break;
            case 1:
                // Les heures clignotent et sont éditables
                this.blinkHours();
                break;
            case 2:
                // Les heures arrêtent de clignoter, les minutes clignotent et sont éditables
                this.stopBlinking();
                this.blinkMinutes();
                break;
        }
    }

    blinkHours() {
        // Implémentation du clignotement des heures
        this.view.blinkElement(TimeType.HOURS);
        this.isHoursEditable = true;
        this.isMinutesEditable = false;
    }

    blinkMinutes() {
        // Implémentation du clignotement des minutes
        this.view.blinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = true;
    }

    stopBlinking() {
        // Arrêter tout clignotement
        this.view.stopBlinkElement(TimeType.HOURS);
        this.view.stopBlinkElement(TimeType.MINUTES);
        this.isHoursEditable = false;
        this.isMinutesEditable = false;
    }
    

    startClock() {
        this.view.init(() => this.handleModeButton(), () => this.handleIncreaseButton());
        setInterval(() => {
            this.model.tick(this.incrementHours, this.incrementMinutes);
            this.incrementHours = false;
            this.incrementMinutes = false;
            this.view.displayTime(this.model.getCurrentTime());
        }, 1000);
    }
}