import {AbstractControl, ValidatorFn} from "@angular/forms";
import * as _ from 'lodash';

export function agreeListValidator(control: AbstractControl) {

    const val = control.value;
    const res = _.every(val, Boolean);

    if (res) { // 유효성 성공
        return null;
    } else {
        return { // errors return
            agreeList: control.value
        };
    }

}
