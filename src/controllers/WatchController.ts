/**
 * This class processes button inputs and updates the model and triggers the view to re-render.
 */

import { WatchModel } from '../models/WatchModel';
enum Mode {
    Normal,
    EditHours,
    EditMinutes
}
export class WatchController {
    private model: WatchModel;
    private mode: Mode = 0; // 0: Normal, 1: Edit Hours, 2: Edit Minutes

    constructor(model: WatchModel) {
        this.model = model;
    }

    displayCurrentTime() {
        return this.model.getCurrentTime();
    }

    // Méthode pour gérer le changement de mode (normal, édition des heures, édition des minutes)
    handleModeButton() {
        this.mode = (this.mode + 1) % 3;
    }

    // Méthode pour incrémenter les heures ou les minutes selon le mode actuel
    handlelightButton() {
        if (this.mode === 1) {
            this.model.incrementHour();
        } else if (this.mode === 2) {
            this.model.incrementMinute();
        }
        this.displayCurrentTime();  
    }

    // Méthode pour gérer le changement de couleur de l'affichage (non liée directement aux classes de gestion du temps)
    handleLightButton() {
        // Implémentation pour changer la couleur de fond, par exemple.
    }

    // Méthode pour gérer le "tick" (incrémentation automatique des secondes)
    startClock() {
        setInterval(() => {
            this.model.tick();
            this.displayCurrentTime();
        }, 1000);
    }
}