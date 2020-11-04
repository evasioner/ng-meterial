import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentBookingCompletePageComponent } from './rent-booking-complete-page.component';

describe('RentBookingCompletePageComponent', () => {
  let component: RentBookingCompletePageComponent;
  let fixture: ComponentFixture<RentBookingCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentBookingCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentBookingCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
