
import './index.css';
import { WatchModel } from './models/WatchModel';
import { WatchView } from './views/WatchView';
import { WatchController } from './controllers/WatchController';

document.addEventListener('DOMContentLoaded', () => {
    const watchDisplay = document.getElementById('watch-display');
    const modeButton = document.getElementById('mode-button');
    const lightButton = document.getElementById('light-button');
    const increaseButton = document.getElementById('increase-button');

    const model = new WatchModel();
    const controller = new WatchController(model);
    const view = new WatchView(controller!, watchDisplay!, modeButton!, lightButton!, increaseButton!);

    controller.startClock(); // Start the clock
    view.startClock(); // Start the clock
    
});


