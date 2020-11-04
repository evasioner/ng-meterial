import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'flightMinuteToHourMinute'
})
export class FlightMinuteToHourMinutePipe implements PipeTransform {

    transform(value: number): string {
        if (!_.isNumber(value)) {
            return '분';
        }

        if (value < 60) {
            return value + '분';
        }

        const minutes: number = Math.floor(value / 60);
        return minutes + '시간 ' + (value - minutes * 60) + '분';
    }

}
