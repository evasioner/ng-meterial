import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelReservationListComponent } from './hotel-reservation-list.component';

describe('HotelReservationListComponent', () => {
  let component: HotelReservationListComponent;
  let fixture: ComponentFixture<HotelReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
