import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time24to12'
})
export class Time24to12Pipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): unknown {

        const time: string = value;
        const getTime: any = time.substring(0, 2);
        const intTime: any = parseInt(getTime, 10);

        let str = '';
        if (intTime < 12) {
            str = '오전';
        } else {
            str = '오후';
        }

        let cvHour = null;
        if (intTime == 12) {
            cvHour = intTime;
        } else {
            cvHour = intTime % 12;
        }

        const res = str + ('0' + cvHour).slice(-2) + time.slice(-3);
        return res;
    }

}
