import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { CommonValidatorService } from '../../services/common-validator/common-validator.service';

@Directive({
    selector: '[koOnly]'
})
export class KoOnlyDirective {
    @Input('koOnly') formcontrol: FormControl;

    constructor(
        private _el: ElementRef,
        private comValidS: CommonValidatorService
    ) { }

    @HostListener('input', ['$event']) inputChange(event) {
        const currentVal = this._el.nativeElement.value;
        this._el.nativeElement.value = this.comValidS.onlyKoInput(currentVal);
        this.formcontrol.patchValue(this._el.nativeElement.value);

        if (currentVal !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }

}
