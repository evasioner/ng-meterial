import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'app-ngx-bootstrap-slider',
    templateUrl: './ngx-bootstrap-slider.component.html',
    styleUrls: ['./ngx-bootstrap-slider.component.scss']
})
export class NgxBootstrapSliderComponent {
    title = 'app';

    valList = [100, 400];

    value: number = 30;
    min: number = 0;
    max: number = 1000;
    enabled: boolean = true;

    constructor() { }


    change() {
        this.enabled = false;
    }

    slideStop() {
        console.log('Stopped');
    }

}
