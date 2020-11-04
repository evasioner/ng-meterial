import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentBasketListComponent } from './rent-basket-list.component';

describe('RentBasketListComponent', () => {
    let component: RentBasketListComponent;
    let fixture: ComponentFixture<RentBasketListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RentBasketListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RentBasketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
