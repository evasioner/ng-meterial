import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Pipe({
    name: 'rentTimeToDateTime'
})
export class RentTimeToDateTimePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        const curDateTime = moment().format('YYYY-MM-DD') + ' ' + value;
        // console.info('[파이프]', curDateTime);
        return curDateTime;
    }

}
