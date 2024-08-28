
import './index.css';
import { ClockManagerController } from './controllers/ClockManagerController';
enum ClockType {
    ANALOG,
    DIGITAL,
}

document.addEventListener('DOMContentLoaded', () => {

    const timeZones = [
        'GMT+12',
        'GMT+11',
        'GMT+10',
        'GMT+9',
        'GMT+8',
        'GMT+7',
        'GMT+6',
        'GMT+5',
        'GMT+4',
        'GMT+3',
        'GMT+2',
        'GMT+1',
        'GMT',
        'GMT-1',
        'GMT-2',
        'GMT-3',
        'GMT-4',
        'GMT-5',
        'GMT-6',
        'GMT-7',
        'GMT-8',
        'GMT-9',
        'GMT-10',
        'GMT-11',
        'GMT-12',
    ];
    const watchManager = new ClockManagerController();

    const dialog = document.getElementById('timezone-dialog') as HTMLDialogElement;
    const timezoneSelect = document.getElementById('timezone') as HTMLSelectElement;

    function populateTimezones() {
        timeZones.forEach((timeZone) => {
            const option = document.createElement('option');
            option.value = timeZone.match(/GMT([+-]\d+)/)?.[1] || "0";
            option.textContent = timeZone;
            timezoneSelect.appendChild(option);
        });
    }

    document.getElementById('add-clock-btn')?.addEventListener('click', () => {
        populateTimezones(); // Populate the dropdown when opening the dialog
        dialog.showModal();
    });

    document.getElementById('confirm-timezone')?.addEventListener('click', () => {
        const selectedTimezone = timezoneSelect.value;
        const selectedType = (document.querySelector('input[name="clock-type"]:checked') as HTMLInputElement).value;
        const clockType = selectedType === 'analog' ? ClockType.ANALOG : ClockType.DIGITAL;
        watchManager.addClock(parseInt(selectedTimezone), clockType);
        dialog.close();
    });

    document.getElementById('close-dialog')?.addEventListener('click', () => {
        dialog.close();
    });
});



