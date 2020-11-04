import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-system-error-base',
    templateUrl: './system-error-base.component.html',
    styleUrls: ['./system-error-base.component.scss']
})
export class SystemErrorBaseComponent {

    @Input() isLoadding: boolean;

    constructor() {
    }
}
