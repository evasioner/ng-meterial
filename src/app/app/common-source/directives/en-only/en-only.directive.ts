import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { CommonValidatorService } from '../../services/common-validator/common-validator.service';

@Directive({
    selector: '[enOnly]'
})
export class EnOnlyDirective {
    @Input('enOnly') formcontrol: FormControl;

    constructor(
        private _el: ElementRef,
        private comValidS: CommonValidatorService
    ) { }


    @HostListener('input', ['$event']) inputChange(event) {
        const currentVal = this._el.nativeElement.value;
        this._el.nativeElement.value = this.comValidS.onlyEnInput(currentVal);
        this.formcontrol.patchValue(this._el.nativeElement.value);
        if (currentVal !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }

}
