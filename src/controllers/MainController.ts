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
        this.view.onCloseDialogBtnClick(() => this.view.closeClockSettingDialog());
        this.view.onInfoBtnClick(() => this.handleInfoBtn());
        this.view.onCloseInfoDialogBtnClick(() => this.handleInfoCloseBtn());
    }

    handleInfoBtn(): void {
        console.log('info button clicked');
        this.view.openInfoDialog();
    }

    handleInfoCloseBtn(): void {
        this.view.closeInfoDialog();
    }

    handleAddClock(): void {
        const timeZones = this.model.getTimeZones();
        this.view.populateTimezones(timeZones);
        this.view.openClockSettingDialog();
    }

    handleConfirmTimezone(): void {
        const selectedTimezone = this.view.getSelectedTimezone();
        const selectedType = this.view.getSelectedClockType();
        const clockType = selectedType === 'analog' ? ClockType.ANALOG : ClockType.DIGITAL;
        this.clocksController.addClock(parseFloat(selectedTimezone), clockType);
        
        this.view.closeClockSettingDialog();
    }

    startClock(): void {}


}