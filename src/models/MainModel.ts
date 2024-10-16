export class MainModel {
    static timeZones = {
        'GMT+12': 12,
        'GMT+11': 11,
        'GMT+10': 10,
        'GMT+9': 9,
        'GMT+8': 8,
        'GMT+7': 7,
        'GMT+6': 6,
        'GMT+5:30': 5.5,
        'GMT+5': 5,
        'GMT+4:30': 4.5,
        'GMT+4': 4,
        'GMT+3:30': 3.5,
        'GMT+3': 3,
        'GMT+2': 2,
        'GMT+1': 1,
        'GMT': 0,
        'GMT-1': -1,
        'GMT-2': -2,
        'GMT-3': -3,
        'GMT-3:30': -3.5,
        'GMT-4': -4,
        'GMT-4:30': -4.5,
        'GMT-5': -5,
        'GMT-5:30': -5.5,
        'GMT-6': -6,
        'GMT-6:30': -6.5,
        'GMT-7': -7,
        'GMT-8': -8,
        'GMT-9': -9,
        'GMT-9:30': -9.5,
        'GMT-10': -10,
        'GMT-11': -11,
        'GMT-12': -12,
    };
    
    getTimeZones(): { [key: string]: number} {
        return MainModel.timeZones;
    }
}