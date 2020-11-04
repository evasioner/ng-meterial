import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
    name: 'timeAmPm'
})
export class TimeAmPmPipe implements PipeTransform {

    /**
     * timeToAmPm
     * 시간을 포함한 날짜를 전달하면 오전, 오후를 출력한다
     *
     * @param value 시간
     * @param dateFormat value의 형태가 날짜-시간 형태가 아니면 value 시간의 데한 형태를 전달한다.
     * ex) time | timeAmPm : 'hh:mm'
     */
    transform(value: string | Date, dateFormat: string): string {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return String(value);
        }

        return moment(value, dateFormat).format('A');
    }
}
