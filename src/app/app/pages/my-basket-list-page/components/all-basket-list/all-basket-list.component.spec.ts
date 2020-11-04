import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBasketListComponent } from './all-basket-list.component';

describe('AllBasketListComponent', () => {
    let component: AllBasketListComponent;
    let fixture: ComponentFixture<AllBasketListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AllBasketListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllBasketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
