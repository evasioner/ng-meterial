import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationHotelDetailPageComponent } from './my-reservation-hotel-detail-page.component';

describe('MyReservationHotelDetailPageComponent', () => {
  let component: MyReservationHotelDetailPageComponent;
  let fixture: ComponentFixture<MyReservationHotelDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationHotelDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationHotelDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
