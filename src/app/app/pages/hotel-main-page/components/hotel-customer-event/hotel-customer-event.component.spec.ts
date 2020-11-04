import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCustomerEventComponent } from './hotel-customer-event.component';

describe('HotelCustomerEventComponent', () => {
  let component: HotelCustomerEventComponent;
  let fixture: ComponentFixture<HotelCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
