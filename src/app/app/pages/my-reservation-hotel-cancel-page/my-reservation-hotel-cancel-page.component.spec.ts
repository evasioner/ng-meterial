import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationHotelCancelPageComponent } from './my-reservation-hotel-cancel-page.component';

describe('MyReservationHotelCancelPageComponent', () => {
  let component: MyReservationHotelCancelPageComponent;
  let fixture: ComponentFixture<MyReservationHotelCancelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationHotelCancelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationHotelCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
