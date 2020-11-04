import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBasketListPageComponent } from './my-basket-list-page.component';

describe('MyBasketListPageComponent', () => {
    let component: MyBasketListPageComponent;
    let fixture: ComponentFixture<MyBasketListPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyBasketListPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyBasketListPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
