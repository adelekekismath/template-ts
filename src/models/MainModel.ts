export class MainModel {
    private timeZones = [
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
    
    getTimeZones(): string[] {
        return this.timeZones;
    }
}