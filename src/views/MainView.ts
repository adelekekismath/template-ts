export class MainView {
    dialog: HTMLDialogElement;
    timezoneSelect : HTMLSelectElement;
    addClockBtn : HTMLElement;
    confirmTimezoneBtn : HTMLElement;
    clockTypeInput : HTMLInputElement

    constructor() {
        this.dialog = document.getElementById('timezone-dialog') as HTMLDialogElement;
        this.timezoneSelect = document.getElementById('timezone') as HTMLSelectElement;
        this.addClockBtn = document.getElementById('add-clock-btn');
        this.confirmTimezoneBtn = document.getElementById('confirm-timezone');
        this.clockTypeInput = document.querySelector('input[name="clock-type"]:checked') as HTMLInputElement;
    }

    populateTimezones(timeZones: string[]): void {
        timeZones.forEach((timeZone) => {
            const option = document.createElement('option');
            option.value = timeZone.match(/GMT([+-]\d+)/)?.[1] || "0";
            option.textContent = timeZone;
            this.timezoneSelect.appendChild(option);
        });
    }

    updateClockTypeInput(): void {
        this.clockTypeInput = document.querySelector('input[name="clock-type"]:checked') as HTMLInputElement;
    }

    onAddClockBtnClick(callback: () => void): void {
        this.addClockBtn?.addEventListener('click', callback);
    }

    onConfirmTimezoneBtnClick(callback: () => void): void {
        this.confirmTimezoneBtn?.addEventListener('click', callback);
    }

    onClockTypeInputChange(callback: () => void): void {
        this.clockTypeInput?.addEventListener('click', callback);
    }

    openDialog(): void {
        this.dialog.showModal();
    }

    closeDialog(): void {
        this.dialog.close();
    }

    getSelectedTimezone(): string {
        return this.timezoneSelect.value;
    }

    getSelectedClockType(): string {
        this.updateClockTypeInput();
        return this.clockTypeInput.value;
    }

   
}