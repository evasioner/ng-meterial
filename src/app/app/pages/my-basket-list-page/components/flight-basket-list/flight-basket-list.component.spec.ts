import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBasketListComponent } from './flight-basket-list.component';

describe('FlightBasketListComponent', () => {
    let component: FlightBasketListComponent;
    let fixture: ComponentFixture<FlightBasketListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FlightBasketListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlightBasketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
