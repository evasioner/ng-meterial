import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBasketListComponent } from './hotel-basket-list.component';

describe('HotelBasketListComponent', () => {
    let component: HotelBasketListComponent;
    let fixture: ComponentFixture<HotelBasketListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HotelBasketListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HotelBasketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
