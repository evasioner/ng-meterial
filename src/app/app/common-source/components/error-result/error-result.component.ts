import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RentModalDetailFilterComponent } from '../../../pages/rent-search-result-page/modal-components/rent-modal-detail-filter/rent-modal-detail-filter.component';
import { RentModalAlignFilterComponent } from '../../../pages/rent-search-result-page/modal-components/rent-modal-align-filter/rent-modal-align-filter.component';
import { FlightModalAlignFilterComponent } from '../../../common-source/modal-components/flight-modal-align-filter/flight-modal-align-filter.component';
import { FlightModalDetailFilterComponent } from '../../../common-source/modal-components/flight-modal-detail-filter/flight-modal-detail-filter.component';
import { HotelModalAlignFilterComponent } from '../../../pages/hotel-search-result-page/modal-components/hotel-modal-align-filter/hotel-modal-align-filter.component';
import { HotelModalDetailFilterComponent } from '../../../pages/hotel-search-result-page/modal-components/hotel-modal-detail-filter/hotel-modal-detail-filter.component';
import { ActivityModalAlignFilterComponent } from '../../../pages/activity-search-result-page/modal-components/activity-modal-align-filter/activity-modal-align-filter.component';
import { ActivityModalDetailFilterComponent } from '../../../pages/activity-search-result-page/modal-components/activity-modal-detail-filter/activity-modal-detail-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-error-result',
    templateUrl: './error-result.component.html',
    styleUrls: ['./error-result.component.scss']
})
export class ErrorResultComponent implements OnInit {
    bsModalFilterRef: any;
    bsModalAlignRef: any;
    @Input() rentError: boolean;
    @Input() flightError: boolean;
    @Input() hotelError: boolean;
    @Input() activityError: boolean;
    @Input() airtelError: boolean;
    @Input() option: any;

    @Output() searchAgain = new EventEmitter();

    constructor(
        private location: Location,
        private bsModalService: BsModalService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    onResearch() {
        let path: any;

        if (this.rentError) path = 'rent-main';
        if (this.flightError) path = 'flight-main';
        if (this.hotelError) path = 'hotel-main';
        if (this.activityError) path = 'activity-main';
        if (this.airtelError) path = 'airtel-main';
        this.searchAgain.emit(path);
        //this.router.navigate([path]);
    }

    onFilterClickRent() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalFilterRef = this.bsModalService.show(RentModalDetailFilterComponent, { initialState, ...configInfo });
    }
    onAlignClickRent() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode

        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalAlignRef = this.bsModalService.show(RentModalAlignFilterComponent, { initialState, ...configInfo });
    }
    onFilterClickFlight() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalFilterRef = this.bsModalService.show(FlightModalDetailFilterComponent, { initialState, ...configInfo });
    }
    onAlignClickFlight() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode

        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalAlignRef = this.bsModalService.show(FlightModalAlignFilterComponent, { initialState, ...configInfo });
    }
    onFilterClickHotel() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalFilterRef = this.bsModalService.show(HotelModalDetailFilterComponent, { initialState, ...configInfo });
    }
    onAlignClickHotel() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode

        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalAlignRef = this.bsModalService.show(HotelModalAlignFilterComponent, { initialState, ...configInfo });
    }
    onFilterClickActivity() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalFilterRef = this.bsModalService.show(ActivityModalDetailFilterComponent, { initialState, ...configInfo });
    }
    onAlignClickActivity() {
        const itemCategoryCode = 'IC03';
        const storeId = '';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            itemCategoryCode: itemCategoryCode

        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalAlignRef = this.bsModalService.show(ActivityModalAlignFilterComponent, { initialState, ...configInfo });
    }
}
