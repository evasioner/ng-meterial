import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-airtel-traveler-information-page',
    templateUrl: './airtel-traveler-information-page.component.html',
    styleUrls: ['./airtel-traveler-information-page.component.scss']
})
export class AirtelTravelerInformationPageComponent implements OnInit {
    public headerType: any;
    public headerConfig: any;

    constructor() {
        this.initialize();
    }

    ngOnInit(): void { }

    private initialize() {
        this.headerType = {};
        this.headerConfig = {};
    }

}
