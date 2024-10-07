import { MainView } from '../views/MainView';
import { MainModel } from '../models/MainModel';
import {ClocksController } from './ClocksController';
import { ClockType } from '../models/Type';

export class MainController {
    private view: MainView;
    private model: MainModel;
    private clocksController: ClocksController;

    constructor() {
        this.view = new MainView();
        this.model = new MainModel();
        this.clocksController = new ClocksController();

        this.initialize();
    }

    initialize(): void {
        this.view.onAddClockBtnClick(() => this.handleAddClock());
        this.view.onConfirmTimezoneBtnClick(()=> this.handleConfirmTimezone())
    }

    handleAddClock(): void {
        const timeZones = this.model.getTimeZones();
        this.view.populateTimezones(timeZones);
        this.view.openDialog();
    }

    handleConfirmTimezone(): void {
        const selectedTimezone = this.view.getSelectedTimezone();
        const selectedType = this.view.getSelectedClockType();
        const clockType = selectedType === 'analog' ? ClockType.ANALOG : ClockType.DIGITAL;
        console.log(selectedType);
        this.clocksController.addClock(parseInt(selectedTimezone), clockType);
        this.view.closeDialog();
    }

    startClock(): void {

    }


}