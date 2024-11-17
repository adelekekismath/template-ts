import 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';
import dialogPolyfill from 'dialog-polyfill';

export class MainView {
    clockSettingDialog: HTMLDialogElement;
    infoDialog: HTMLDialogElement;
    timezoneSelect : HTMLSelectElement;
    addClockBtn : HTMLElement;
    infoBtn : HTMLElement;
    confirmTimezoneBtn : HTMLElement;
    closeDialogBtn : HTMLElement;
    closeInfoDialogBtn : HTMLElement;
    clockTypeInput : HTMLInputElement

    constructor() {
        this.clockSettingDialog = document.getElementById('timezone-dialog') as HTMLDialogElement;
        this.infoDialog = document.getElementById('info-dialog') as HTMLDialogElement;
        this.registerAsDialogPolyfill(this.clockSettingDialog);
        this.registerAsDialogPolyfill(this.infoDialog);
        this.timezoneSelect = document.getElementById('timezone') as HTMLSelectElement;
        this.addClockBtn = document.getElementById('add-clock-btn');
        this.infoBtn = document.getElementById('info-btn');
        this.confirmTimezoneBtn = document.getElementById('confirm-timezone');
        this.closeDialogBtn = document.getElementById('close-dialog');
        this.closeInfoDialogBtn = document.getElementById('close-info-dialog');
        this.clockTypeInput = document.querySelector('input[name="clock-type"]:checked') as HTMLInputElement;
    }

    populateTimezones(timeZones: { [key: string]: number }): void {
        const timeZonesArray = Object.keys(timeZones);
        timeZonesArray.forEach((timeZone) => {
            const option = document.createElement('option');
            option.value = timeZones[timeZone].toString();
            option.textContent = timeZone;
            this.timezoneSelect.appendChild(option);
        });
    }

    registerAsDialogPolyfill(dialog : HTMLDialogElement): void {
        dialogPolyfill.registerDialog(dialog);
    }



    updateClockTypeInput(): void {
        this.clockTypeInput = document.querySelector('input[name="clock-type"]:checked') as HTMLInputElement;
    }

    onAddClockBtnClick(callback: () => void): void {
        this.addClockBtn?.addEventListener('click', callback);
    }

    onInfoBtnClick(callback: () => void): void {
        this.infoBtn?.addEventListener('click', callback);
    }

    onCloseInfoDialogBtnClick(callback: () => void): void {
        this.closeInfoDialogBtn?.addEventListener('click', callback);
    }

    onConfirmTimezoneBtnClick(callback: () => void): void {
        this.confirmTimezoneBtn?.addEventListener('click', callback);
    }

    onCloseDialogBtnClick(callback: () => void): void {
        this.closeDialogBtn?.addEventListener('click', callback);
    }

    onClockTypeInputChange(callback: () => void): void {
        this.clockTypeInput?.addEventListener('click', callback);
    }

    openClockSettingDialog(): void {
        this.clockSettingDialog.showModal();
    }

    closeClockSettingDialog(): void {
        this.clockSettingDialog.close();
    }

    openInfoDialog(): void {
        this.infoDialog.showModal();
    }

    closeInfoDialog(): void {
        this.infoDialog.close();
    }

    getSelectedTimezone(): string {
        return this.timezoneSelect.value;
    }

    getSelectedClockType(): string {
        this.updateClockTypeInput();
        return this.clockTypeInput.value;
    }

   
}